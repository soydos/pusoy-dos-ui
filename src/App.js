import React from "react";
import {
    Router,
    Route,
    Link 
} from "react-router-dom";


import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from 'redux-observable';
import FrontPage from "./pages/front_page/FrontPage";
import About from "./pages/about/About";
import Privacy from "./pages/privacy/Privacy";
import Feedback from "./pages/feedback/Feedback";
import FeedbackSuccess from "./pages/feedback/FeedbackSuccess";
import Login from "./pages/login/Login";
import rootEpic from './epics/rootEpic';
import history from './history';
import logo from "../assets/images/logo-landscape.svg";
import css from './App.sass';
import Auth from './auth/Auth';

import { LOGGED_IN } from './actions/auth';

import reducers from './reducers/rootReducer';

const epicMiddleware = createEpicMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(epicMiddleware)
    )
);

const auth = new Auth(store.dispatch.bind(store));
epicMiddleware.run(rootEpic(auth));

if(auth.isAuthenticated()) {
  store.dispatch({ type: LOGGED_IN });
}

const inGameCache = {};

const App = () => {
  return(
    <Provider store={store}>
      <Router history={history}>
        <header>
            <span className={css.logo}>
                <img src={logo}/>
            </span>
            <span className={css.tagline}>
                The Pu is silent
            </span>
        </header>
        <Route
            path="/"
            render={(props) => <FrontPage {...props} 
                inGameCache={inGameCache} />}
             exact
        />
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
