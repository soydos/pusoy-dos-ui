import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link 
} from "react-router-dom";

import Game from "./pages/game/Game";
import About from "./pages/about/About";

import css from './App.sass';

const App = () => {
  return(
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
        <Route path="/" exact component={Game} />
        <Route path="/about/" component={About} />
    </Router>
  );
}

export default App;
