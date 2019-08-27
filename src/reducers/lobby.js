import { LOBBY_INFO } from '../actions/game.js';

export default function (state = null, action) {
  switch (action.type) {
    case LOBBY_INFO:
      return action.data;
    default:
      return state
  }
}
