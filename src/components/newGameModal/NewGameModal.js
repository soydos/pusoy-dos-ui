import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/auth.js';

import { Link } from "react-router-dom";

import css from './NewGameModal.sass';

const NewGameModal = ({
  deal,
  close,
  onLogin,
  loggedIn,
  title,
  cta
}) => {

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

  function getToggleClassName(item, selected) {
    let className = `${css.toggle} ${css[item]}`;

    if(item === selected) {
        className += ' ' + css.selectedToggle;
    }

    return className;
  }

  function onClick() {
    let j = ruleset == 'pickering' ? jokers : 0;
    deal(decks, j, ruleset);
  }

  return (
    <div>
        <div className={css.newGame}>
        <h5>
          { title }
          <span className={css.close} onClick={close}>x</span>
        </h5>
        <div className={`${css.body} ${css[ruleset]}`}>
            <p className={css.field}>
                Players:

                  <span className={css.fieldValue}>4</span>
            </p>

            <p className={css.field}>
                Rules: 
                <span className={css.fieldValue}
                    onClick={() => setRuleset('classic')}
                >
                    <span className={
                      getToggleClassName('classic', ruleset)
                    }>
                    Classic
                    <span className={css.flag}></span>
                    </span>
                </span>
                <span className={css.fieldValue}
                    onClick={() => setRuleset('pickering')}
                >
                    <span className={
                      getToggleClassName('pickering', ruleset)
                    }>
                    Pickering
                        <span className={css.flag}></span>
                    </span>
                </span>
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
            <p className={css.jokers}>
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

            <div className={css.clearfix}></div>
            <hr/>
            <button
                className={css.button_calltoaction}
                onClick={onClick}
            >
            { cta }
            </button>
        </div>
    </div>
    </div>
  )
};

NewGameModal.propTypes = {
    deal: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onLogin: () => dispatch(login)
});

export default connect(
    null,
    mapDispatchToProps
)(NewGameModal);
