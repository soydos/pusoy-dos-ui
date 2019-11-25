import { CURRENT_GAMES_LOADED } from '../actions/user';

const defaultState = {
  current: [],
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case CURRENT_GAMES_LOADED:
      return {
        ...state,
        current: [
            {id:1, status: 'pending'},
            {id:2, status: 'active'}
        ],
      };
    default:
      return state
  }
}
