import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link 
} from "react-router-dom";

import Game from "./pages/game/Game";
import About from "./pages/about/About";
import Privacy from "./pages/privacy/Privacy";

import css from './App.sass';

const store = {};
const App = () => {
  return(
    <div>
      <Router>
{/*      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>
*/}
        <Route
            path="/"
            render={(props) => <Game {...props} store={store} />}
             exact
        />
        <Route path="/about/" component={About} />
        <Route path="/privacy/" component={Privacy} />

      <footer>
        <span className={css.copyright}>
          &copy; 2019 soydos.com
        </span>
        <div className={css.links}>
{/*
        <span className="feedback">
          <a href="#">Feedback</a>
        </span>
*/}

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

      <div>
        <small className={css.buildVersion}>
          build: {window.pd_build}
        </small>
      </div>
      </footer>

      </Router>
    </div>
  );
}

export default App;
