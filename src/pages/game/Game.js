import React, { useState, useEffect, useRef } from 'react';

import Player from '../../components/player/Player';
import Opponent from '../../components/opponent/Opponent';

import Card from '../../components/card/Card';
import NewGame from '../../components/new_game/NewGame';

import css from './Game.sass';

const Game = () => {
  // Just hardcode for now
  const overlap = 30;
  const players = [
    'player',
    'cpu1',
    'cpu2',
    'cpu3',
  ];

  // State
  const [ selected, setSelected] = useState([]);
  const [ handLabel, setHandLabel ] = useState('Pass');
  const [ playerCards, setPlayerCards ] = useState([]);
  const [ wasm, setWasm ] = useState(null);
  const [ game, setGame ] = useState(null);
  const [ lastMove, setLastMove ] = useState(null);
  const [ nextPlayer, setNextPlayer ] = useState(null);

  const [ cardWidth, setCardWidth ] = useState(0);

  const movesRef = useRef(null);

   useEffect(() => {
    const width = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'), 10);
    setCardWidth(width);
  });

  // Load WASM library
  useEffect(() => {
    import( /* webpackChunkName: "wasm" */'wasm-pusoy-dos').then(wasm => {
      setWasm(wasm);
    });
  }, []);

  // Get Move Label
  useEffect(() => {
    const move = wasm &&
      wasm.get_hand_type(selected) ||
      {type: "Invalid Hand"};

    const type = move.type;
    const hand = move.cards;

    let joker = false;

    switch (type) {
      case 'single':
        joker = hand.is_joker;
        setHandLabel(`${hand.rank} of ${hand.suit}${joker ? ' (Joker)' : ''}`);
        break;
      case 'pair':
      case 'prial':
        joker = hand.some(card => card.is_joker);
        setHandLabel(`${type} of ${hand[0].rank}${hand[0].rank === 'six' ? 'es' : 's'}${joker ? ' (Joker)' : ''}`);
        break;
      case 'fivecardtrick':
        switch (hand.trick_type) {
          case 'flush':
            joker = hand.cards.some(card => card.is_joker);
            setHandLabel(`${hand.cards[0].suit} flush${joker ? ' (Joker)' : ''}`);
            break;
          case 'fullhouse':
            joker = hand.cards.some(card => card.is_joker);
            setHandLabel(`Full House${joker ? ' (Joker)' : ''}`);
            break;
          case 'fourofakind':
            joker = hand.cards.some(card => card.is_joker);
            setHandLabel(`Four of a Kind${joker ? ' (Joker)' : ''}`);
            break;
          default:
            joker = hand.cards.some(card => card.is_joker);
            setHandLabel(`${type}${joker ? ' (Joker)' : ''}`);
            break;
        }
        break;
      default:
        setHandLabel(type);
    }
  }, [selected, wasm])

  function cpuUpdate() {
    return new Promise((resolve) => {
        if(wasm && game && nextPlayer !== players[0]){
            setTimeout(() => {
                let cards = wasm.get_cpu_move(game);
                wasm.submit_move(game, nextPlayer, cards);
                setLastMove(wasm.get_last_move(game));
                if (cards.length) {
                  const translateFrom = {
                    'cpu1': 'translate(-50vw, 0)',
                    'cpu2': 'translate(0, -40vh)',
                    'cpu3': 'translate(50vw, 0)'
                  };
                  movesRef.current.style.transition = 'unset';
                  movesRef.current.style.transform = translateFrom[nextPlayer];
                  setTimeout(() => {
                    movesRef.current.style.transition = 'transform 0.25s';
                    movesRef.current.style.transform = 'unset';
                  }, 0);
                }
                setNextPlayer(wasm.get_next_player(game));
                resolve();
            }, 2000);
        } else {
            resolve();
        }
    });
  }

  useEffect(() => {
    cpuUpdate()
  }, [nextPlayer, game, wasm])

  // Functions/Callbacks
  function onDeal() {
    let game = wasm.create_game(players)
    setGame(game);
    let player = wasm.get_player(game, players[0]);
    let joker = 0;
    const playerCards = player.map(card => ({...card, id: card.type === 'joker' ? `joker${joker++}` : `${card.rank}${card.suit}`}));
    setPlayerCards(playerCards);
    setNextPlayer(wasm.get_next_player(game));
  }

  function onSubmit() {
    let result = wasm.submit_move(game, 'player', selected);
    let joker = 0;
    const playerCards = getPlayerCards(players[0]).map(card => ({...card, id: card.type === 'joker' ? `joker${joker++}` : `${card.rank}${card.suit}`}));
    setPlayerCards(playerCards);
    setSelected([]);
    setLastMove(wasm.get_last_move(game));
    setNextPlayer(wasm.get_next_player(game));
  }

  function getPlayerCards(player) {
    return wasm.get_player(game, player);
  }

  function getHiddenCards(player) {
    return getPlayerCards(player).map((_, index) => index);
  }

  function displayLastMove() {
    if(!lastMove) {
      return;
    }

    const cardList = getMoveCards();

    return (
      <div
        ref={movesRef}
        className={css.moves}
        style={{ width: cardList.length * overlap + (cardWidth - overlap) + 'px' }}
      >
        { getHandCards() }
      </div>
    );
  }

  function getMoveCards() {
    let cardList = [];
    if(lastMove.cards && lastMove.cards.map) {
      cardList = lastMove.cards;
    } else if (lastMove.cards && lastMove.cards.cards) {
      cardList = lastMove.cards.cards;
    } else if (lastMove.cards) {
      cardList = [lastMove.cards];
    } else {
      cardList = []
    }

    return cardList;
  }

  function getHandCards() {
    const cardList = getMoveCards();

    console.log(cardList);
    return cardList.map((card, index) => {
      const style = { left : index * overlap + 'px' };
      return <Card
        card={card}
        style={style}
        key={index}
      />
    });

  }

  function getFrontPage(mainSection) {
    return (<div className={css.splashscreen}>
        <h1>soydos.com</h1>
        <div>
            {mainSection}
        </div>
    </div>);
  }

  // HTML
  const table = game ? (
    <div className={css.game}>
      <div className={css.table}>
        <div id={css.cpu1} className={nextPlayer === players[1] ? css.turn : undefined}>
          <Opponent cards={getHiddenCards(players[1])} vertical={true} />
        </div>
        <div id={css.cpu2} className={nextPlayer === players[2] ? css.turn : undefined}>
          <Opponent cards={getHiddenCards(players[2])} />
        </div>
        <div id={css.cpu3} className={nextPlayer === players[3] ? css.turn : undefined}>
          <Opponent cards={getHiddenCards(players[3])} vertical={true} />
        </div>
        { displayLastMove() }
        {nextPlayer === players[0] &&
            <div className={css.action}>
              <button onClick={onSubmit}>play {handLabel}</button>
            </div>
        }
        <div className={css.player}>
          <Player cards={playerCards} onSelect={setSelected} />
        </div>
      </div>
    </div>
  ) : (
    getFrontPage(
        <NewGame onClick={onDeal} />
    )

  );

  return wasm ? (
    table
  ) : (
    getFrontPage(<h1>Loading</h1>)
  );
}

export default Game;

