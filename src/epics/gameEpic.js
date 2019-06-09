import {
  CREATE_GAME
} from '../actions/game';
import { filter, tap, map } from 'rxjs/operators';

const emptyAction = { type: 'EMPTY' };

export default (game) => {
  const createGameEpic = action$ => action$.pipe(
      filter(action => action.type === CREATE_GAME),
      tap(action => {
        game.createGame({
          decks: action.decks,
          jokers: action.jokers,
          ruleset: action.ruleset
        });
      }),
      map(ev => (emptyAction))
  );

  return {
    createGameEpic,
  };
};
