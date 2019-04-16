import { LOGGED_IN } from '../actions/auth';

const defaultAuth = false;

export default function (state = defaultAuth, action) {
  switch (action.type) {
    case LOGGED_IN:
      return true;
    default:
      return state
  }
}
