import {
  BEGIN_GAME,
  GAME_CREATED,
} from '../actions/game.js';
import { filter, tap, map } from 'rxjs/operators';
import history from '../history';

const emptyAction = { type: 'EMPTY' };

export const beginGameEpic = action$ => action$.pipe(
  filter(action => action.type === BEGIN_GAME),
  tap(ev => {
    history.push("/game");
  }),
  map(ev => (emptyAction))
);

export const gameCreatedEpic = action$ => action$.pipe(
  filter(action => action.type === GAME_CREATED),
  tap(action => {
    history.push(`/lobby/${action.id}`);
  }),
  map(ev => (emptyAction))
);

