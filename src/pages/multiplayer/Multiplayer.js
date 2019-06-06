import React, { useState } from 'react';
import Game from "../game/Game";
import NewGameModal from "../../components/newGameModal/NewGameModal";
import css from "./Multiplayer.sass";

const MULTIPLAYER_GAME = 'multiplayer';
const SINGLEPLAYER_GAME = 'computer';

const Multiplayer = () => {

    const [ gameType, setGameType ] = useState(null)

    function onDeal(decks, jokers, ruleset) {

        // depending on game type, we're looking at going
        // into a single player game or a multiplayer lobby
        
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

export default Multiplayer;
