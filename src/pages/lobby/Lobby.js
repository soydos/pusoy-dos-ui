import React from 'react';

const Lobby = ({ match }) => {

    const gameId = match.params.id;
    return (<div>
        <h1>{gameId}</h1>
    </div>);
};

export default Lobby;
