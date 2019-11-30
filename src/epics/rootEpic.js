import { combineEpics } from 'redux-observable';

import loginEpics from './loginEpic';
import gameEpics from './gameEpic';
import {
  beginGameEpic,
  gameCreatedEpic 
} from './historyEpic';

// todo - inject epic object, not deps
export default (auth, game) => {

  const { 
    loginEpic,
    handleLoginEpic,
    loggedInEpic,
    logoutEpic,
    checkAuthEpic
  } = loginEpics(auth);

  const {
    createGameEpic,
    requestLobbyEpic,
    getCurrentGamesEpic,
    getGameEpic,
    joinGameEpic,
  } = gameEpics(game);

  return combineEpics(
    loginEpic,
    handleLoginEpic,
    loggedInEpic,
    logoutEpic,
    beginGameEpic,
    gameCreatedEpic,
    createGameEpic,
    requestLobbyEpic,
    checkAuthEpic,
    getCurrentGamesEpic,
    getGameEpic,
    joinGameEpic,
  );
};

