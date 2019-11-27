import { CURRENT_GAMES_LOADED } from '../actions/user';

const defaultState = {
  current: [],
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case CURRENT_GAMES_LOADED:
      return {
        ...state,
        current: action.data.games.map(
            game => ({status: "pending", ...game}))
      };
    default:
      return state
  }
}
