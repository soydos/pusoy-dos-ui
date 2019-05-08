import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Game from "../game/Game";
import Multiplayer from "../multiplayer/Multiplayer";

const FrontPage = ({ inGameCache, loggedIn }) => {

    return loggedIn ? 
        <Multiplayer /> :
        <Game store={inGameCache} />;
};

FrontPage.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    inGameCache: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    loggedIn: state.auth
});

export default connect(
    mapStateToProps
)(FrontPage);
