import { combineReducers } from 'redux';
import auth from './auth';
import game from './game';
import playerGames from './playerGames';
import selectedGame from './selectedGame';

export default combineReducers({
  auth,
  game,
  playerGames,
  selectedGame,
});
