import { BEGIN_GAME } from '../actions/game';

export default function (state = {}, action) {
  switch (action.type) {
    case BEGIN_GAME:
      return {
        decks: action.decks,
        jokers: action.jokers,
        ruleset: action.ruleset,
        ...state
      };
    default:
      return state
  }
}
