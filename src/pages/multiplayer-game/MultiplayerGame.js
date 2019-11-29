import { LOAD_GAME } from "../../actions/game";
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';

const MultiplayerGame = ({ match, loadGame, gameInfo }) => {
    useEffect(()=>loadGame(match.params.id), []);

    function getJoinButton() {
        if(gameInfo && !gameInfo.inGame){
            return (<button>Join</button>);
        }
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
});

export default connect(
  /*mapStateToProps*/ null,
  mapDispatchToProps,
)(MultiplayerGame);

