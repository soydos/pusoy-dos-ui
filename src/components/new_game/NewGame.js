import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { beginLogin } from '../../actions/auth.js';

import { Link } from "react-router-dom";

import logo from "../../../assets/images/logo-landscape.svg";

import css from './NewGame.sass';

const NewGame = ({deal, onLogin, loggedIn}) => {

  const DEFAULT_JOKERS = 2;
  const DEFAULT_DECKS = 1;
  const DEFAULT_RULESET = 'pickering';

  const [ decks, setDecks ] = useState(DEFAULT_DECKS);
  const [ jokers, setJokers] = useState(DEFAULT_JOKERS);
  const [ ruleset, setRuleset] = useState(DEFAULT_RULESET);

  function updateJokers(ev) {
    setJokers(parseInt(ev.target.value, 10));
  }

  function updateDecks(ev) {
    setDecks(parseInt(ev.target.value, 10));
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

  function getCallToAction() {
    return 'Deal';
  }

  return (
    <div>
    <p className={css.logo}><img src={logo}/></p>
    <p className={css.tagline}>The Pu is silent</p>
    <div className={css.loginCta}>
      <button onClick={onLogin}>
          Login to play with your friends
      </button>
    </div>

    <p className={css.intro}>
        Pusoy Dos is an addictive card game for 2 or more players
        where the aim is to be the first player to get rid of all 
        of your cards.
        Play <strong>Pickering Rules</strong> or <strong>Classic</strong> Pusoy Dos against the computer.

    </p>
    <p className={css.secondaryCta}>
      <span className={css.howtoplay}>
        <Link 
          to="/about"
        >
          Learn how to play
        </Link>
      </span>
    </p>
    <div className={css.newGame}>
        <h5>New Game</h5>
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
            { getCallToAction() }
            </button>
        </div>


    </div>

    </div>
  )
};

NewGame.propTypes = {
    deal: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn
});

const mapDispatchToProps = dispatch => ({
  onLogin: () => dispatch(beginLogin)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGame);
