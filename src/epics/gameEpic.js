import {
  CREATE_GAME,
  GAME_CREATED,
  REQUEST_LOBBY,
  LOBBY_INFO,
  LOAD_GAME,
  GAME_LOADED,
  JOIN_GAME,
  GAME_JOINED,
  DEAL_GAME,
  DEAL_COMPLETE,
  SUBMIT_MOVE,
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

  const getGameEpic = action$ => action$.pipe(
      filter(action => action.type === LOAD_GAME),
      switchMap(action => {
        return from(game.loadGame(action.id)).pipe(
          map(action => (
            { type: GAME_LOADED, data: action.data }
          )),
          catchError(error => of({
            type: CURRENT_GAMES_LOAD_ERROR
          }))
        );
      }),
  );

  const joinGameEpic = action$ => action$.pipe(
      filter(action => action.type === JOIN_GAME),
      switchMap(action => {
        return from(game.joinGame(action.id)).pipe(
          map(action => (
            { type: GAME_JOINED }
          )),
          catchError(error => of({
            type: CURRENT_GAMES_LOAD_ERROR
          }))
        );
      }),
  );

  const dealGameEpic = action$ => action$.pipe(
      filter(action => action.type === DEAL_GAME),
      switchMap(action => {
        return from(game.deal(action.id)).pipe(
          map(action => (
            { type: DEAL_COMPLETE }
          )),
          catchError(error => of({
            type: CURRENT_GAMES_LOAD_ERROR
          }))
        );
      }),
  );

  const submitMoveEpic = action$ => action$.pipe(
      filter(action => action.type === SUBMIT_MOVE),
      switchMap(action => {
        const id = action.id;
        return from(game.submitMove(action.id, action.selected)).pipe(
          map(action => (
            { type: LOAD_GAME, id }
          )),
          catchError(error => of({
            type: SUBMIT_ERROR
          }))
        );
      }),
  );


  return {
    createGameEpic,
    requestLobbyEpic,
    getCurrentGamesEpic,
    getGameEpic,
    joinGameEpic,
    dealGameEpic,
    submitMoveEpic,
  };
};
