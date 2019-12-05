import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Player from '../../components/player/Player';
import Opponent from '../../components/opponent/Opponent';
import Card from '../../components/card/Card';
import SuggestedMove from '../../components/suggested_move/SuggestedMove';

import css from './Game.sass';

const Game = ({ decks, jokers, ruleset }) => {
  // Just hardcode for now
  const overlap = 30;
  const players = [
    'player',
    'cpu1',
    'cpu2',
    'cpu3',
  ];


  // State
  const [ playerCards, setPlayerCards ] = useState([]);
  const [ wasm, setWasm ] = useState(null);
  const [ game, setGame ] = useState(null);
  const [ lastMove, setLastMove ] = useState(null);
  const [ nextPlayer, setNextPlayer ] = useState([]);

  const [ winners, setWinners ] = useState([]);
  const [ validMove, setValidMove ] = useState(null);
  const [ gameOver, setGameOver ] = useState(false);
  const [ selected, setSelected] = useState([]);
  const [ handLabel, setHandLabel ] = useState('Pass');
  const [ showTips, setShowTips ] = useState(null);
  const [ cardWidth, setCardWidth ] = useState(0);
  const [ suitOrder, setSuitOrder ] = useState([]);

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

    setHandLabel(getHandDescription(move));
    setValidMove( /* red|green|null */ getIsValidMove(selected))
  }, [selected, wasm])


  function getIsValidMove(selected) {
    if(selected.length == 0){
        return null;
    }

    return wasm.check_move(game, selected) ? 'green' : 'red';
  }

  function getHandDescription(move) {
    const type = move.type;
    const hand = move.cards;

    let joker = false;

    switch (type) {
      case 'single':
        joker = hand.is_joker;
        return `${hand.rank} of ${hand.suit}${joker ? ' (Joker)' : ''}`;
        break;
      case 'pair':
      case 'prial':
        joker = hand.some(card => card.is_joker);
        return `${type} of ${hand[0].rank}${hand[0].rank === 'six' ? 'es' : 's'}${joker ? ' (Joker)' : ''}`;
        break;
      case 'fivecardtrick':
        switch (hand.trick_type) {
          case 'flush':
            joker = hand.cards.some(card => card.is_joker);
            return `${hand.cards[0].suit} flush${joker ? ' (Joker)' : ''}`;
            break;
          case 'fullhouse':
            joker = hand.cards.some(card => card.is_joker);
            return `Full House${joker ? ' (Joker)' : ''}`;
            break;
          case 'fourofakind':
            joker = hand.cards.some(card => card.is_joker);
            return `Four of a Kind${joker ? ' (Joker)' : ''}`;
            break;
          default:
            joker = hand.cards.some(card => card.is_joker);
            return `${type}${joker ? ' (Joker)' : ''}`;
            break;
        }
        break;
      default:
        return type;
    }
  }

  function cpuUpdate() {
    return new Promise((resolve) => {
        if(wasm && game && nextPlayer !== players[0]){
            setTimeout(() => {

                if(!nextPlayer) {
                    // todo some winners table intermediate bit
                    console.log('game over!');
                    setGameOver(true);
                    setLastMove(null);
                    setNextPlayer(null);
                    return resolve();
                }

                let cards = wasm.get_cpu_move(game);
                let result = wasm.submit_move(game, nextPlayer, cards);

                if(result !== true) {
                    console.log(result);
                }

                setLastMove(wasm.get_last_move(game));
                setNextPlayer(wasm.get_next_player(game));
                updateSuitOrder();
                
                resolve();
            }, 2000);
        } else {
            resolve();
        }
    });
  }

  useEffect(() => {
    cpuUpdate()
    updateWinners()
  }, [nextPlayer, game, wasm])

  // Functions/Callbacks
  function setup() {
    if(!wasm) { return }

    setGameOver(false);
    setLastMove(null);
    setNextPlayer(null);
    setWinners([]);

    const game = wasm.create_game(players, decks, jokers, ruleset)
    setGame(game);
    const player = wasm.get_player(game, players[0]);
    const playerCards = assignCardIds(player);
    setPlayerCards(playerCards);

    const nextPlayer = wasm.get_next_player(game);
    setNextPlayer(nextPlayer);
    updateSuitOrder();
  }

  function updateSuitOrder() {
    if(!wasm || !game) {
        return
    }

    const suits = wasm.get_suit_order(game);
    setSuitOrder(suits);
  }

  function onNewGame() {
    setGame(null);
    setNextPlayer(null);
    setLastMove(null);
    setPlayerCards([]);

    setGameOver(false);
  }

  function assignCardIds(cards) {
    let joker = 0;
    return cards.map(card => ({...card, id: card.type === 'joker' ? `joker${joker++}` : `${card.rank}${card.suit}${card.deck_id}`}));

  }

  function updateWinners(){
    let winnersList = wasm && game && wasm.get_winners(game);
    setWinners(winnersList || []);
  }

  function displayWinners(){
    const leaderboard = winners.slice();
    
    const losers = players
        .filter(id => !winners.includes(id));

    return leaderboard.concat(losers).map((id, index) => {
       const cards = getPlayerCards(id).map((card, index) => {
            return (<Card
                card={card}
                style={
                  {
                    position:'relative',
                    left:(index * -25 + 'px'),
                    height: '80px',
                    width: '55px',
                    display: 'inline-block'
                  }
                }
                key={index}
              />);
        });
       return (<li key={`winner-${index}`}>
            {id}
            <div>{ cards }</div>
        </li>);
    });

  }

  function onHelp() {
    const lastMoveDescription = lastMove && getHandDescription(lastMove);
    const suggestedMove = wasm.suggest_move(game, players[0]);

    const move = lastMove || { type: false };
    const description = lastMoveDescription || false;

    if(showTips == null){
      setShowTips(
        <SuggestedMove
          lastMoveType={move.type}
          lastMove={description}
          suggestedMove={suggestedMove}
          close={()=>{setShowTips(null)}}
        />)
    } else {
      setShowTips(null);
    }
  }

  function onSubmit() {
    let result = wasm.submit_move(game, 'player', selected);
    const playerCards = assignCardIds(getPlayerCards(players[0]));
    setPlayerCards(playerCards);
    setSelected([]);

    setLastMove(wasm.get_last_move(game));
    setNextPlayer(wasm.get_next_player(game));
    updateSuitOrder(); 
    setShowTips(null);
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

    return cardList.map((card, index) => {
      const style = { left : index * overlap + 'px' };
      return <Card
        card={card}
        style={style}
        key={index}
      />
    });

  }

  function getSuitOrder() {
    const suitMap = {
      'spades': '&spades;',
      'diamonds': '&diams;',
      'hearts': '&hearts;',
      'clubs': '&clubs;'
    };
    const suits = suitOrder.slice().reverse().map((suit, index) => {
      return (<li className={`${css.suit} ${css[suit]}`} key={suit}
        dangerouslySetInnerHTML={{__html:suitMap[suit]}} />);
    });

    if(ruleset === 'pickering' && suitOrder.length > 0) {
        return (<ul className={css.suitList}>
            { suits }
        </ul>);
    }

    return null;
  }

  function getFrontPage(mainSection) {
    return (<div className={css.splashscreen}>
        <div>
            {mainSection}
        </div>
    </div>);
  }

  // HTML
  const table = wasm && game && (
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
        <div>
          { getSuitOrder() }
        </div>
        {nextPlayer === players[0] &&
            <div className={css.action}>
            {validMove !== 'red' ?
              <div className={css.action}>
                <button onClick={onSubmit}>
                  play {handLabel}
                </button>
              </div>  :
              <div className={css.invalid}>
                Unable to play {handLabel} -&nbsp;
                    <a href="#" onClick={onHelp}>help</a>
              </div>
            }

              <div className={css.help} onClick={onHelp}>
                <span>Help</span>
              </div>
            </div>
        }
        <div className={css.player}>
          <Player cards={playerCards} onSelect={setSelected} />
        </div>
      </div>
      { showTips }
    </div>
  );

  const gameSummary = gameOver && (
    getFrontPage(
      <div className={css.gameSummary}>
        <h3>Game Rankings</h3>
        <ol>
          { displayWinners() }
        </ol>
        <button
          className={css.button_calltoaction}
          onClick={onNewGame}
        >
          New Game
        </button>
      </div>
    )
  );

  let page;
  if(gameOver) {
    page = gameSummary;
  } else if (game) {
    page = table;
  } else {
    setup()
  }

  return wasm && page ? (
    page
  ) : (
    getFrontPage(<h1>Loading</h1>)
  );
}

Game.propTypes = {
  decks: PropTypes.number.isRequired,
  jokers: PropTypes.number.isRequired,
  ruleset: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  decks: state.game.decks || 1,
  jokers: state.game.jokers || 2,
  ruleset: state.game.ruleset || 'pickering',
});

export default connect(
  mapStateToProps,
)(Game);
