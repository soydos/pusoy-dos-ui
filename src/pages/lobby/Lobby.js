import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { requestLobby } from '../../actions/game.js';

const Lobby = ({ match, onLoad, lobby }) => {

    useEffect(() => {onLoad(match.params.id)}, [ match ]);

    const gameId = match.params.id;

    function getGame() {
      return (<div>
        <h1>{lobby.id}</h1>
        <p>{lobby.msg}</p>
      </div>);
    }

    function getLoading() {
      return (<div>Loading</div>);
    }

    return lobby ? getGame() : getLoading();
};

Lobby.propTypes = {
    onLoad: PropTypes.func.isRequired,
    lobby: PropTypes.object
};

const mapStateToProps = state => ({
    lobby: state.lobby
});

const mapDispatchToProps = dispatch => ({
  onLoad: (id) => dispatch(requestLobby(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
