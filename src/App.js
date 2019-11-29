import React from "react";
import {
    Router,
    Route,
    Link 
} from "react-router-dom";


import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from 'redux-observable';
import https from 'https';
import axios from 'axios';
import Account from "./components/account/Account";
import FrontPage from "./pages/front_page/FrontPage";
import About from "./pages/about/About";
import GamePage from "./pages/game/Game";
import Privacy from "./pages/privacy/Privacy";
import Feedback from "./pages/feedback/Feedback";
import FeedbackSuccess from "./pages/feedback/FeedbackSuccess";
import Login from "./pages/login/Login";
import MultiplayerGame from "./pages/multiplayer-game/MultiplayerGame";
import rootEpic from './epics/rootEpic';
import history from './history';
import logo from "../assets/images/logo-landscape.svg";
import css from './App.sass';
import Auth from './auth/Auth';
import createGame from './game/Game';

import { CHECK_AUTH } from './actions/auth';

import reducers from './reducers/rootReducer';

const epicMiddleware = createEpicMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(epicMiddleware)
    )
);

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  }),
  baseURL: window.api_root,
});

axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = window.api_root;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.withCredentials = true;

const auth = new Auth(store.dispatch.bind(store), axiosInstance);
const game = createGame(axiosInstance);
epicMiddleware.run(rootEpic(auth, game));

store.dispatch({type: CHECK_AUTH});

/*
    TODO:
    - 404
    - error boundary
*/
const App = () => {
  return(
    <Provider store={store}>
      <Router history={history}>
        <header>
            <Link to="/" className={css.logo}>
                <img src={logo}/>
            </Link>
            <Account />
            <span className={css.tagline}>
                The Pu is silent
            </span>
        </header>
        <Route path="/" component={FrontPage} exact />
        <Route path="/game/:id" component={MultiplayerGame} />
        <Route path="/game/" component={GamePage} exact />
        <Route path="/about/" component={About} />
        <Route path="/privacy/" component={Privacy} />
        <Route path="/feedback/" component={Feedback} />
        <Route
            path="/feedback-success/"
            component={FeedbackSuccess}
        />

        <Route path="/login/" component={Login} />


      <footer>
        <span className={css.copyright}>
          &copy; 2019 soydos.com
        </span>
        <div className={css.links}>

        <span className={css.footerLink}>
          <Link to="/feedback">Feedback</Link>
        </span>

        <span className={css.footerLink}>
          <a href="https://github.com/soydos/pusoy-dos-ui">
            Contribute
          </a>
        </span>
&nbsp;
        <span className={css.footerLink}>
            <Link to="/privacy">Privacy Policy</Link>
        </span>
      </div>

      <div className={css.clearfix}>
        <small className={css.buildVersion}>
          build: {window.pd_build}
        </small>
      </div>
      </footer>

      </Router>
    </Provider>
  );
}

export default App;
