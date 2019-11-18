import { 
  LOGIN_ACTION,
  HANDLE_LOGIN,
  LOGGED_IN,
  LOGOUT_ACTION,
  REDEEM_TOKEN
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
        return from(auth.redeemToken({
          token: action.accessToken
        })).pipe(
          map(action => ({
            type: LOGIN_COMPLETE, 
          })),
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

    return {
      loginEpic,
      handleLoginEpic,
      loggedInEpic,
      logoutEpic,
    };
};
