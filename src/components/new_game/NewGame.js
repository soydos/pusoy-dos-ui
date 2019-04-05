import React, { useState } from 'react';

import css from './NewGame.sass';
import img from './yorkshire_flag.svg';

const NewGame = ({deal}) => {

  const DEFAULT_JOKERS = 2;
  const DEFAULT_DECKS = 1;

  const [ decks, setDecks ] = useState(DEFAULT_DECKS);
  const [ jokers, setJokers] = useState(DEFAULT_JOKERS);

  function updateJokers(ev) {
    setJokers(ev.target.value);
  }

  function updateDecks(ev) {
    setDecks(ev.target.value);
  }

  function onClick() {
    deal(decks, jokers);
  }

  return (
    <div className={css.newGame}>
        <h5>New Game</h5>
        <p className={css.field}>
            Players:
            <span className={css.fieldValue}>4</span>
        </p>
        <p className={css.field}>
            Decks:
            <span className={css.fieldValue}>
                <select value={decks} onChange={updateDecks}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </span>
        </p>
        <p className={css.field}>
            Jokers:
            <span className={css.fieldValue}>
                <select value={jokers} onChange={updateJokers}>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>

                </select>
            </span>
        </p>
        <p className={css.field}>
            Rules: 
            <span className={css.fieldValue}>Pickering
            <img
                src={img}
                height="30px"
                className={css.inlineFlag}
            /></span>
        </p>
        <hr/>
        <button
            className={css.button_calltoaction}
            onClick={onClick}
        >
        Deal
        </button>
    </div>
  )
};

export default NewGame;
