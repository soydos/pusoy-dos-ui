import auth0 from 'auth0-js';
import { login } from '../actions/auth.js';

export default class Auth {

  constructor (dispatch, ajax) {
      this.auth0 = new auth0.WebAuth({
        domain: 'soydos.eu.auth0.com',
        clientID: window.clientId,
        redirectUri: `${window.location.origin}/login`,
        responseType: 'token id_token',
        scope: 'openid profile email'
      });

      this.dispatch = dispatch;
      this.ajax = ajax;
  }

  login() {
    this.auth0.authorize();
  }

  redeemToken(token) {
    return this.ajax.post('/redeem-token', { token })
  }

 handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.log(err);
        this.logout();
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    console.log(authResult);
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    this.dispatch(login(this.accessToken));
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
       }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    this.ajax.post('/logout').then(() => {
        this.auth0.logout();
    });
  }

  isAuthenticated() {
    return this.ajax.get('/auth');
  }
}

