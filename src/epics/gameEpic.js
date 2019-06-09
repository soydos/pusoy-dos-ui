import {
  CREATE_GAME
} from '../actions/game';
import { from } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

const emptyAction = { type: 'EMPTY' };

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
      tap(action => {
        console.log(action)
      }),
      map(ev => (emptyAction))
  );

  return {
    createGameEpic,
  };
};
