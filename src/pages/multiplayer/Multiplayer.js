import React, { useState } from 'react';
import Game from "../game/Game";
import NewGameModal from "../../components/newGameModal/NewGameModal";
import css from "./Multiplayer.sass";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { beginGame, createGame } from "../../actions/game";

const MULTIPLAYER_GAME = 'multiplayer';
const SINGLEPLAYER_GAME = 'computer';

const Multiplayer = ({onNewCPUGame, onNewMultiplayerGame}) => {

    const [ gameType, setGameType ] = useState(null)

    function onDeal(decks, jokers, ruleset) {

        if(gameType === SINGLEPLAYER_GAME){
            return onNewCPUGame(decks, jokers, ruleset)
        }

        if(gameType === MULTIPLAYER_GAME){
            return onNewMultiplayerGame(decks, jokers, ruleset)
        }
        
    }

    function createGameTypeToggle(target) {
        return () => {
            const newGameType = gameType === target ?
                null :
                target
            setGameType(newGameType)
        }
    }

    function clearGameType() {
      setGameType(null)
    }

    function getModalTitle() {
      return gameType === MULTIPLAYER_GAME ?
        'New Multiplayer Game' :
        'New Game'
    }

    function getModalCta() {
      return gameType === MULTIPLAYER_GAME ?
        'Create' :
        'Deal'
    }

    return (
      <>
      <div className={css.multiplayer}>
        { /* <Game store={inGameCache} /> */ }
        <span
          className={css.button}
          onClick={createGameTypeToggle(MULTIPLAYER_GAME)}
        >
          Play against your friends
        </span>
        <span>OR</span>
        <span
          className={css.button}
          onClick={createGameTypeToggle(SINGLEPLAYER_GAME)}
        >
          Play against the computer
        </span>
      </div>

      { gameType && 
        <NewGameModal
          deal={onDeal}
          close={clearGameType}
          type={gameType}
          title={ getModalTitle() }
          cta={ getModalCta() }
        /> 
      }
      </>
    )
};

Multiplayer.propTypes = {
  onNewCPUGame: PropTypes.func.isRequired,
  onNewMultiplayerGame: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onNewCPUGame: (decks, jokers, ruleset) => dispatch(beginGame(
    decks, jokers, ruleset
  )),
  onNewMultiplayerGame: (decks, jokers, ruleset) => dispatch(
    createGame(decks, jokers, ruleset)
  )

});


export default connect(
  null,
  mapDispatchToProps,
)(Multiplayer);
