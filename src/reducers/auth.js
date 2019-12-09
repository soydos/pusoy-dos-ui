import { COMPLETE_LOGIN } from '../actions/auth';

const defaultAuth = { loggedIn: false, user: null };

export default function (state = { ...defaultAuth}, action) {
  switch (action.type) {
    case COMPLETE_LOGIN:
      return { ...state, loggedIn: true, user: action.user };
    default:
      return state
  }
}
