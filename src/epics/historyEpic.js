import {
  BEGIN_GAME
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

