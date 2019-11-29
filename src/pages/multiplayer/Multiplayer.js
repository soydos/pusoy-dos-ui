import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Game from "../game/Game";
import NewGameModal from "../../components/newGameModal/NewGameModal";
import css from "./Multiplayer.sass";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { beginGame, createGame } from "../../actions/game";
import { LOAD_CURRENT_GAMES } from "../../actions/user";
const MULTIPLAYER_GAME = 'multiplayer';
const SINGLEPLAYER_GAME = 'computer';

const Multiplayer = (
    {
      onNewCPUGame,
      onNewMultiplayerGame,
      currentGames,
      loadCurrentGames,
    }
    ) => {

    const [ gameType, setGameType ] = useState(null)

    useEffect(loadCurrentGames, []);

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

    function getCurrentGames() {
        let activeGames = filterGames('Active');
        let pendingGames = filterGames('Pending');
        return (<div className={css.currentGames}>
            <h3>Your Games</h3>
            { activeGames.length > 0 &&
              <>
                <h4>Active Games</h4>
                { activeGames }
              </>
            }

            { pendingGames.length > 0 &&
              <>
                <h4>Games not started</h4>
                { pendingGames }
              </>
            }

        </div>);
    }

    function getGameLink(game) {
        return (<div key={game.id} className={css.gameLink}>
            <Link to={`/game/${game.id}`}>
              { game.id }
            </Link>
        </div>);
    }

    function filterGames(status) {
        return currentGames.filter(
            game => (game.status === status)
        ).map(getGameLink)
    }

    return (
      <>
      <div className={css.multiplayer}>
        <h3>New Game</h3>
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


      {
        (currentGames.length > 0) &&
            getCurrentGames()
      }
      </>
    )
};

Multiplayer.propTypes = {
  onNewCPUGame: PropTypes.func.isRequired,
  onNewMultiplayerGame: PropTypes.func.isRequired,
  currentGames: PropTypes.array.isRequired,
  loadCurrentGames: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    currentGames: state.playerGames.current
});

const mapDispatchToProps = dispatch => ({
  onNewCPUGame: (decks, jokers, ruleset) => dispatch(beginGame(
    decks, jokers, ruleset
  )),
  onNewMultiplayerGame: (decks, jokers, ruleset) => dispatch(
    createGame(decks, jokers, ruleset)
  ),
  loadCurrentGames: () => {
    dispatch({ type: LOAD_CURRENT_GAMES })
  },
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Multiplayer);
