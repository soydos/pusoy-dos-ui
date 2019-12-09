import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Player from '../../components/player/Player';
import Opponent from '../../components/opponent/Opponent';
import Card from '../../components/card/Card';
import SuggestedMove from '../../components/suggested_move/SuggestedMove';
import { getHandDescription } from '../../game_utils';
import { SUBMIT_MOVE } from '../../actions/game';

import css from './Game.sass';

const Game = ({
    cards,
    users,
    decks,
    jokers,
    ruleset,
    lastPlayedMove,
    currentPlayer,
    nextP,
    submitMove,
}) => {
  // Just hardcode for now
  const overlap = 30;
  const players = [
    'player',
    'cpu1',
    'cpu2',
    'cpu3',
  ];


  // State
  const [ playerCards, setPlayerCards ] = useState(assignCardIds(cards));
  const [ wasm, setWasm ] = useState(null);
  const [ game, setGame ] = useState(null);
  const [ lastMove, setLastMove ] = useState(lastPlayedMove);
  const [ nextPlayer, setNextPlayer ] = useState(nextP);

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
//    setValidMove(getIsValidMove(selected)) // green|red|null
  }, [selected, wasm])


  function getIsValidMove(selected) {
    if(selected.length == 0){
        return null;
    }

    return wasm.check_move(game, selected) ? 'green' : 'red';
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
/*
  function setup() {
    if(!wasm) { return }

    setGameOver(false);
    setLastMove(null);
    setNextPlayer(null);
    setWinners([]);

    const game = wasm.create_game(players, decks, jokers, ruleset)
    setGame(game);
    const playerCards = assignCardIds(cards);
    setPlayerCards(playerCards);

    const nextPlayer = wasm.get_next_player(game);
    setNextPlayer(nextPlayer);
    updateSuitOrder();
  }
*/

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
    // todo - wasm validation
    submitMove(selected);
    // temp remove cards for speed
    selected.forEach(selectedCard => {
        const i = cards.findIndex(card => (card.rank === selectedCard.rank && card.suit === selectedCard.suit))
        cards.splice(i, 1);
    });

    setSelected([]);
    setPlayerCards(assignCardIds(cards));
    setShowTips(null);
    setNextPlayer(null);
  }

  function getPlayerCards(player) {
    return wasm.get_player(game, player);
  }

  function getHiddenCards(cardCount) {
    return [...Array(cardCount).keys()];
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

  function displayOpponents() {
    return users.filter((_, index) => index > 0)
        .map((user, index) => {
            return (
                <div key={index} id={css[`cpu${index + 1}`]} className={nextPlayer === user.sub ? css.turn : undefined}>
                  <Opponent cards={getHiddenCards(user.card_count)} vertical={true} />
                </div>
            )
        });
  }

  // HTML
  const table = (
    <div className={css.game}>
      <div className={css.table}>
        { displayOpponents() }
        { displayLastMove() }
        <div>
          { getSuitOrder() }
        </div>
        {nextPlayer === currentPlayer &&
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

  return gameOver ? gameSummary : table;
}

Game.propTypes = {
  decks: PropTypes.number.isRequired,
  jokers: PropTypes.number.isRequired,
  ruleset: PropTypes.string.isRequired,
  cards: PropTypes.array,
  users: PropTypes.array,
  lastPlayedMove: PropTypes.array,
  currentPlayer: PropTypes.string,
  nextP: PropTypes.string,
  submitMove: PropTypes.func
};

const mapStateToProps = state => ({
  decks: state.selectedGame.decks || 1,
  jokers: state.selectedGame.jokers || 2,
  ruleset: state.selectedGame.ruleset || 'pickering',
  cards: state.selectedGame.cards,
  users: state.selectedGame.users,
  lastPlayedMove: state.selectedGame.lastMove,
  currentPlayer: state.auth.user.sub,
  nextP: state.selectedGame.nextPlayer,
});

const mapDispatchToProps = dispatch => ({
    submitMove: (selected) => {
        dispatch({ type: SUBMIT_MOVE, selected });
    },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
