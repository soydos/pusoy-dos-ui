import { LOAD_GAME, JOIN_GAME, DEAL_GAME } from "../../actions/game";
import Game from "../../components/game/Game";
import { connect } from 'react-redux';
import { beginLogin } from '../../actions/auth.js';
import React, { useState, useEffect } from 'react';
import css from './MultiplayerGame.sass';
import aceOfSpades from '../../../assets/images/cards/card-spades-a.svg';

const POLL_RATE = 5000;

const MultiplayerGame = ({
    match,
    loadGame,
    gameInfo,
    joinGame,
    dealGame,
    loggedIn,
    userId,
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
            return (<button className={css.joinButton}
                        onClick={onJoinGame}>
                        Accept invitation
                    </button>);
        }
    }

    function getPlayerList() {
        if(gameInfo && gameInfo.users) {

            let users = gameInfo.users.map(user => {
                const currentUser = user.sub === userId;
                const className = `${css.user} ${currentUser?css.current:''}`;
                return (
                <li className={className} key={user.sub}>
                    <img width="75" src={user.picture} />
                    <span className={css.name}>{user.name}</span>
                </li>
                );
            });
            return (<div>
                <h4 className={css.header}>Players</h4>
                <ul>
                    { users }
                </ul>
            </div>);
        }
    }

    function getDealButton() {
        if(gameInfo && gameInfo.created) {
            if(gameInfo.users.length < 2) {
              return (<h4 className={css.waiting}>
                Waiting for players to join
              </h4>);

            }

            if(gameInfo.users.length > 1 && !clickedDealButton){
                return (<button onClick={onDealGame}>Deal</button>);
            }
        } else {
            return (<h4 className={css.waiting}>
                Waiting for game to begin
            </h4>);
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

    function getSharingComponent() {
        const url = window.location.toString();
        const message = `Please join my game of pusoy dos! ${url}`;
        const encodedMessage = encodeURIComponent(message);
        return (
            <div className={css.invite}>
                <h4>Invite Your Friends</h4>
                <div className={css.icons}>
                    <span className={css.sharingLink}>
                      <input readOnly value={url} />
                    </span>
                    <a 
                        className={css.sharingWhatsapp}
                        target="_blank"
                        href={`https:/\/wa.me\/?text=${encodedMessage}`}
                    >
                    </a>
                </div>
            </div>
        );
    }

    function getInvitationComponent() {
        return (
            <div className={css.invite}>
                <h4>You've been invited to play Pusoy Dos</h4>
                { getJoinButton() }
            </div>
        );
    }


    function getGameInfo() {
        return (<>
            <p>Game Type: <span>{gameInfo.ruleset}</span></p>
            <p>Decks: <span>{gameInfo.decks}</span></p>
            <p>Jokers: <span>{gameInfo.jokers}</span></p>
        </>);
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
                    { /*<div className={css.decorativeCard}>
                        <img className={css.decorativeCard}
                         width="120" src={aceOfSpades}/>
                    </div> */ }
                    { gameInfo.inGame ? 
                        getSharingComponent() :
                        getInvitationComponent() }
                    { getGameInfo() }
                    { getDealButton() }
                    { getPlayerList() }
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
    userId: state.auth.user && state.auth.user.sub
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

