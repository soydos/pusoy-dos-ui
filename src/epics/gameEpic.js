import {
  CREATE_GAME,
  GAME_CREATED,
  REQUEST_LOBBY,
  LOBBY_INFO
} from '../actions/game';
import { from } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

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

  return {
    createGameEpic,
    requestLobbyEpic,
  };
};
