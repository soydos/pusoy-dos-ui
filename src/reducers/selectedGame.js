import { GAME_LOADED } from '../actions/game';

export default function (state = {}, action) {
  switch (action.type) {
    case GAME_LOADED:
      return {
        ...state,
        created: action.data.created_user,
        inGame: action.data.in_game,
        users: action.data.users,
        status: action.data.status,
        cards: action.data.hand,
        lastMove: action.data.last_move,
        nextPlayer: action.data.next_player,
      };
    default:
      return state
  }
}
