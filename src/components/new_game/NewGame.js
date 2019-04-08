import React, { useState } from 'react';

import { Link } from "react-router-dom";

import css from './NewGame.sass';
import yorks_flag from './yorkshire_flag.svg';
import phil_flag from './Flag_of_the_Philippines.svg';

const NewGame = ({deal}) => {

  const DEFAULT_JOKERS = 2;
  const DEFAULT_DECKS = 1;
  const DEFAULT_RULESET = 'pickering';

  const [ decks, setDecks ] = useState(DEFAULT_DECKS);
  const [ jokers, setJokers] = useState(DEFAULT_JOKERS);
  const [ ruleset, setRuleset] = useState(DEFAULT_RULESET);

  function updateJokers(ev) {
    setJokers(ev.target.value);
  }

  function updateDecks(ev) {
    setDecks(ev.target.value);
  }

  function updateRuleset(rulename) {
    setRuleset(rulename);
  }

  function getToggleClassName(rules) {
    let className = css.toggle;

    if(rules === ruleset) {
        className += ' ' + css.selectedToggle;
    }

    return className;
  }

  function onClick() {
    deal(decks, jokers, ruleset);
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
            <span className={css.fieldValue}
                onClick={() => updateRuleset('classic')}
            >
                <span className={getToggleClassName('classic')}>
                Classic
                <img
                    src={phil_flag}
                    height="20px"
                    className={css.inlineFlag}
                /></span>
            </span>
            <span className={css.fieldValue}
                onClick={() => updateRuleset('pickering')}
            >
                <span className={getToggleClassName('pickering')}>
                Pickering
                <img
                    src={yorks_flag}
                    height="20px"
                    className={css.inlineFlag}
                /></span>
            </span>
        </p>
        <div>
          <span className={css.fieldValue}>
            <Link 
              to="/about"
            >
              Pusoy Dos rules
            </Link>
          </span>
        </div>
        <div className={css.clearfix}></div>
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
