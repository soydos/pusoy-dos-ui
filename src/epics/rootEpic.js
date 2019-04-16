import { combineEpics } from 'redux-observable';

import loginEpics from './loginEpic.js';

export default (auth) => {

  const { 
    loginEpic,
    handleLoginEpic,
    loggedInEpic 
  } = loginEpics(auth);

  return combineEpics(
    loginEpic,
    handleLoginEpic,
    loggedInEpic
  );
};

