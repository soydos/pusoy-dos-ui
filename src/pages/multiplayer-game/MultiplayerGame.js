import { LOAD_GAME, JOIN_GAME, DEAL_GAME } from "../../actions/game";
import Game from "../../components/game/Game";
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';

const MultiplayerGame = ({
    match,
    loadGame,
    gameInfo,
    joinGame,
    dealGame,
}) => {
    const [clickedJoinButton, setClickedJoinButton] = useState(false);
    const [clickedDealButton, setClickedDealButton] = useState(false);

    useEffect(()=>loadGame(match.params.id), []);

    function getJoinButton() {
        if(gameInfo && !gameInfo.inGame && !clickedJoinButton){
            return (<button onClick={onJoinGame}>Join</button>);
        }
    }

    function getPlayerList() {
        if(gameInfo && gameInfo.users) {

            let users = gameInfo.users.map(user => (
                <li key={user.sub}>{ user.name }</li>
            ));
            return (<div>
                <h4>Players</h4>
                <ul>
                    { users }
                </ul>
            </div>);
        }
    }

    function getDealButton() {
        if(gameInfo && gameInfo.created && gameInfo.users.length > 1 && !clickedDealButton){
            return (<button onClick={onDealGame}>Deal</button>);
        }
    }

    function onJoinGame() {
        setClickedJoinButton(true);
        joinGame(match.params.id);
    }

    function onDealGame() {
        setClickedDealButton(true);
        dealGame(match.params.id);
    }

    function getMainSection() {
        if(gameInfo.status === "Pending") {
            return (
                <>
                    <h1>multiplayer game {match.params.id}</h1>
                    { getJoinButton() }
                    { getPlayerList() }
                    { getDealButton() }
                </>
            );
        } else if(gameInfo.status === "Active") {
            return <Game />
        }
    }

    return (<div>
        { getMainSection() }
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
  },
  dealGame: (id) => {
    dispatch({ type: DEAL_GAME, id })
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MultiplayerGame);

