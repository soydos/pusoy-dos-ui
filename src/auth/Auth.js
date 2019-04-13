import auth0 from 'auth0-js';

export default class Auth {
  constructor () {
      this.auth0 = new auth0.WebAuth({
        domain: 'soydos.eu.auth0.com',
        clientID: 'TMBpQzS83vI11fEz3n3VV1z4Wxg4fjmq',
        redirectUri: 'http://0.0.0.0:8080/login',
        responseType: 'token id_token',
        scope: 'openid'
      });
  }

  login() {
    this.auth0.authorize();
  }
}

