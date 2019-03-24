import React from 'react';

import css from './NewGame.sass';
import img from './yorkshire_flag.svg';

const NewGame = ({onClick}) => {

  return (
    <div className={css.newGame}>
        <h5>New Game</h5>
        <p className={css.field}>
            Players:
            <span className={css.fieldValue}>4</span>
        </p>
        <p className={css.field}>
            Decks:
            <span className={css.fieldValue}>1</span>
        </p>
        <p className={css.field}>
            Jokers:
            <span className={css.fieldValue}>4</span>
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
