import { GAME_LOADED } from '../actions/game';

export default function (state = {}, action) {
  switch (action.type) {
    case GAME_LOADED:
      return {
        created: action.created_user,
        inGame: action.in_game,
        ...state
      };
    default:
      return state
  }
}
