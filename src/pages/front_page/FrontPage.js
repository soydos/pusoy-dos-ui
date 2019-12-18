import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewGame from "../../components/new_game/NewGame";
import Multiplayer from "../multiplayer/Multiplayer";
import { beginGame } from "../../actions/game";


const FrontPage = ({ loggedIn, onNewGame }) => {
    return loggedIn ? 
        <Multiplayer /> :
        <NewGame deal={onNewGame} />;
};

FrontPage.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn
});

const mapDispatchToProps = dispatch => ({
  onNewGame: (decks, jokers, ruleset) => dispatch(beginGame(
    decks, jokers, ruleset
  ))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FrontPage);
