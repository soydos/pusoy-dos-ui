export default (ajax) => {
  function createGame(description) {
    return ajax.post('/game', description)
  }

  function requestLobby(id) {
    return Promise.resolve({ data: {
      id,
      msg: 'yo from my lobby',
    }});
  }

  return {
    createGame,
    requestLobby
  }
};
