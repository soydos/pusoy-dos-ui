import { LOAD_GAME, JOIN_GAME, DEAL_GAME } from "../../actions/game";
import Game from "../../components/game/Game";
import { connect } from 'react-redux';
import { beginLogin } from '../../actions/auth.js';
import React, { useState, useEffect } from 'react';

const POLL_RATE = 5000;

const MultiplayerGame = ({
    match,
    loadGame,
    gameInfo,
    joinGame,
    dealGame,
    loggedIn,
    onLogin
}) => {
    const [clickedJoinButton, setClickedJoinButton] = useState(false);
    const [clickedDealButton, setClickedDealButton] = useState(false);

    useEffect(()=>{
        loadGame(match.params.id);
        let keepLoading = setInterval(()=>{
            loadGame(match.params.id);
        }, POLL_RATE);

        return ()=>{
            clearInterval(keepLoading);
        };
    }, []);

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
        if(!loggedIn) {
            return (
                <>
                  <p>You're not logged in!</p>
                  <p><button onClick={onLogin}>Log in to play.</button></p>
                </>
            );
        }

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
            return <Game gameId={match.params.id} />
        }
    }

    return (<div>
        { getMainSection() }
    </div>);
};

const mapStateToProps = state => ({
    gameInfo: state.selectedGame,
    loggedIn: state.auth.loggedIn,
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
  onLogin: () => dispatch(beginLogin)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MultiplayerGame);

