import { 
  LOGIN_ACTION,
  HANDLE_LOGIN,
  LOGGED_IN,
  LOGOUT_ACTION
} from '../actions/auth.js';
import { filter, tap, map } from 'rxjs/operators';
import history from '../history';

const emptyAction = { type: 'EMPTY' };

export default (auth) => {
    const loginEpic = action$ => action$.pipe(
      filter(action => action.type === LOGIN_ACTION),
      tap(ev => {
        auth.login();
      }),
      map(ev => (emptyAction))
    );

    const handleLoginEpic = action$ => action$.pipe(
      filter(action => action.type === HANDLE_LOGIN),
      tap(ev => {
        auth.handleAuthentication();
      }),
      map(ev => (emptyAction))
    );

    const loggedInEpic = action$ => action$.pipe(
      filter(action => action.type === LOGGED_IN),
      tap(ev => {
        if(location.pathname == '/login') {
          history.push('/')
        }
      }),
      map(ev => (emptyAction))
    );

    const logoutEpic = action$ => action$.pipe(
      filter(action => action.type === LOGOUT_ACTION),
      tap(ev => {
        auth.logout();
      }),
      map(ev => (emptyAction))
    );

    return {
      loginEpic,
      handleLoginEpic,
      loggedInEpic,
      logoutEpic,
    };
};
