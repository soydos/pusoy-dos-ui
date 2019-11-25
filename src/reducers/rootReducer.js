import { combineReducers } from 'redux';
import auth from './auth';
import game from './game';
import lobby from './lobby';
import playerGames from './playerGames';

export default combineReducers({
  auth,
  game,
  lobby,
  playerGames,
});
