import { combineEpics } from 'redux-observable';

import loginEpics from './loginEpic';
import gameEpics from './gameEpic';
import { beginGameEpic } from './historyEpic';

// todo - inject epic object, not deps
export default (auth, game) => {

  const { 
    loginEpic,
    handleLoginEpic,
    loggedInEpic,
    logoutEpic,
  } = loginEpics(auth);

  const {
    createGameEpic,
  } = gameEpics(game);

  return combineEpics(
    loginEpic,
    handleLoginEpic,
    loggedInEpic,
    logoutEpic,
    beginGameEpic,
    createGameEpic,
  );
};

