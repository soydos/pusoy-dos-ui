import { LOGGED_IN } from '../actions/auth';

const defaultAuth = { loggedIn: false, idToken: null };

export default function (state = { ...defaultAuth}, action) {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, loggedIn: true };
    default:
      return state
  }
}
