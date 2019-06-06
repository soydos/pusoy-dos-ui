import { combineReducers } from 'redux';
import auth from './auth';
import game from './game';

export default combineReducers({
  auth,
  game
});
