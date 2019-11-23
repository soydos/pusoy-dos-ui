import { 
  LOGIN_ACTION,
  HANDLE_LOGIN,
  LOGGED_IN,
  LOGOUT_ACTION,
  REDEEM_TOKEN,
  COMPLETE_LOGIN,
  CHECK_AUTH,
} from '../actions/auth';
import {
  switchMap,
  filter,
  tap,
  map,
  catchError,
} from 'rxjs/operators';
import { from, of } from 'rxjs';
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
      switchMap(action => {
        return from(auth.redeemToken(action.accessToken)).pipe(
          tap(ev => {
            if(window.location.pathname === "/login"){
                window.location = '/';
            }
          }),
          catchError(error => of({
            type: LOGOUT_ACTION,
          }))
        )
      })
    );

    const logoutEpic = action$ => action$.pipe(
      filter(action => action.type === LOGOUT_ACTION),
      tap(ev => {
        auth.logout();
      }),
      map(ev => (emptyAction))
    );

    const checkAuthEpic = action$ => action$.pipe(
      filter(action => action.type === CHECK_AUTH),
      switchMap(action => {
        return from(auth.isAuthenticated()).pipe(
          map(action => ({
            type: COMPLETE_LOGIN, 
          })),
          catchError(error => of(emptyAction))
        )
      })
    );

    return {
      loginEpic,
      handleLoginEpic,
      loggedInEpic,
      logoutEpic,
      checkAuthEpic
    };
};
