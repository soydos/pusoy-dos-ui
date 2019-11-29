import { GAME_LOADED } from '../actions/game';

export default function (state = {}, action) {
  switch (action.type) {
    case GAME_LOADED:
      return {
        created: action.data.created_user,
        inGame: action.data.in_game,
        ...state
      };
    default:
      return state
  }
}
