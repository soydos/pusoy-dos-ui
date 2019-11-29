import { combineReducers } from 'redux';
import auth from './auth';
import game from './game';
import lobby from './lobby';
import playerGames from './playerGames';
import selectedGame from './selectedGame';

export default combineReducers({
  auth,
  game,
  lobby,
  playerGames,
  selectedGame,
});
