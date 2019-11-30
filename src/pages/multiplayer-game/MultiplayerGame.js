import { LOAD_GAME, JOIN_GAME } from "../../actions/game";
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';

const MultiplayerGame = ({ match, loadGame, gameInfo, joinGame }) => {
    let clickedJoinButton = false;

    useEffect(()=>loadGame(match.params.id), []);

    function getJoinButton() {
        if(gameInfo && !gameInfo.inGame && !clickedJoinButton){
            return (<button onClick={onJoinGame}>Join</button>);
        }
    }

    function onJoinGame() {
        clickedJoinButton = true;
        joinGame(match.params.id);
    }

    return (<div>
        <h1>multiplayer game {match.params.id}</h1>

        { getJoinButton() }
    </div>);
};

const mapStateToProps = state => ({
    gameInfo: state.selectedGame
});

const mapDispatchToProps = dispatch => ({
  loadGame: (id) => {
    dispatch({ type: LOAD_GAME, id })
  },
  joinGame: (id) => {
    dispatch({ type: JOIN_GAME, id })
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MultiplayerGame);

