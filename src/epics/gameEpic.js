import {
  CREATE_GAME,
  GAME_CREATED,
  REQUEST_LOBBY,
  LOBBY_INFO
} from '../actions/game';
import {
  LOAD_CURRENT_GAMES,
  CURRENT_GAMES_LOAD_ERROR,
  CURRENT_GAMES_LOADED 
} from '../actions/user';
import { from, of } from 'rxjs';
import {
  filter,
  tap,
  map,
  switchMap,
  catchError 
} from 'rxjs/operators';

export default (game) => {
  const createGameEpic = action$ => action$.pipe(
      filter(action => action.type === CREATE_GAME),
      switchMap(action => {
        return from(game.createGame({
          decks: action.decks,
          jokers: action.jokers,
          ruleset: action.ruleset
        }));
      }),
      map(action => ({ type: GAME_CREATED, id: action.data.id }))
  );

  const requestLobbyEpic = action$ => action$.pipe(
      filter(action => action.type === REQUEST_LOBBY),
      switchMap(action => {
        return from(game.requestLobby(action.id));
      }),
      map(action => ({ type: LOBBY_INFO, data: action.data }))

  );

  const getCurrentGamesEpic = action$ => action$.pipe(
      filter(action => action.type === LOAD_CURRENT_GAMES),
      switchMap(action => {
        return from(game.loadCurrentGames()).pipe(
          map(action => (
            { type: CURRENT_GAMES_LOADED, data: action.data }
          )),
          catchError(error => of({
            type: CURRENT_GAMES_LOAD_ERROR
          }))
        );
      }),
  );

  return {
    createGameEpic,
    requestLobbyEpic,
    getCurrentGamesEpic
  };
};
