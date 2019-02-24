import React, { useState, useEffect, useRef } from 'react';

import Player from '../../components/player/Player';
import Opponent from '../../components/opponent/Opponent';

import css from './Game.sass';

const Game = () => {
  // Just hardcode for now
  const players = [
    'player',
    'cpu1',
    'cpu2',
    'cpu3',
  ];

  // State
  const [ selected, setSelected] = useState([]);
  const [ handLabel, setHandLabel ] = useState('Pass');
  const [ wasm, setWasm ] = useState(null);
  const [ game, setGame ] = useState(null);

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
  }, [selected, wasm]);

  // Functions/Callbacks
  function onDeal() {
    setGame(wasm.create_game(players));
  }

  function getPlayerCards(player) {
    return wasm.get_player(game, player);
  }

  function getHiddenCards(player) {
    return getPlayerCards(player).map((_, index) => index);
  }

  // HTML
  const table = game ? (
    <div className={css.game}>
        <div className={css.opponents}>
          <div id={css.cpu1}>
            <Opponent cards={getHiddenCards(players[1])} vertical={true} />
          </div>
          <div id={css.cpu2}>
            <Opponent cards={getHiddenCards(players[2])} />
          </div>
          <div id={css.cpu3}>
            <Opponent cards={getHiddenCards(players[3])} vertical={true} />
          </div>
        </div>
        <div className={css.player}>
          <Player cards={getPlayerCards(players[0])} onSelect={setSelected} />
        </div>
        <div>{handLabel}</div>
    </div>
  ) : (
    <button onClick={onDeal}>Deal!</button>
  );

  return wasm ? (
    table
  ) : (
    <h1>Loading</h1>
  );
}

export default Game;

