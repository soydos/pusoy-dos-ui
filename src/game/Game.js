export default (ajax) => {
  function createGame(description) {
    return ajax.post('/game', description)
  }

  return {
    createGame,
  }
};
