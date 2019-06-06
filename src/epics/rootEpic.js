import { combineEpics } from 'redux-observable';

import loginEpics from './loginEpic';
import { beginGameEpic } from './historyEpic';

export default (auth) => {

  const { 
    loginEpic,
    handleLoginEpic,
    loggedInEpic,
    logoutEpic,
  } = loginEpics(auth);

  return combineEpics(
    loginEpic,
    handleLoginEpic,
    loggedInEpic,
    logoutEpic,
    beginGameEpic
  );
};

