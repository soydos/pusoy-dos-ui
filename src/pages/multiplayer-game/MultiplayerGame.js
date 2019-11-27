import React, { useState, useEffect } from 'react';

const MultiplayerGame = ({match}) => {

    return (<div>
        <h1>multiplayer game {match.params.id}</h1>
    </div>);
};

/*
const mapStateToProps = state => ({
    currentGames: state.playerGames.current
});

const mapDispatchToProps = dispatch => ({
  onNewCPUGame: (decks, jokers, ruleset) => dispatch(beginGame(
    decks, jokers, ruleset
  )),
  onNewMultiplayerGame: (decks, jokers, ruleset) => dispatch(
    createGame(decks, jokers, ruleset)
  ),
  loadCurrentGames: () => {
    dispatch({ type: LOAD_CURRENT_GAMES })
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MultiplayerGame);
*/

export default MultiplayerGame;
