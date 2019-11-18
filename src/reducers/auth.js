import { COMPLETE_LOGIN } from '../actions/auth';

const defaultAuth = { loggedIn: false };

export default function (state = { ...defaultAuth}, action) {
  switch (action.type) {
    case COMPLETE_LOGIN:
      return { ...state, loggedIn: true };
    default:
      return state
  }
}
