import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

import '../style/variables.sass';

import preloadCards from './preloadCards.js';

preloadCards()
ReactDOM.render(
    <App />,
    document.getElementById("container")
);

