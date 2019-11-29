export default (ajax) => {
  function createGame(description) {
    return ajax.post('/game', description)
  }

  function loadCurrentGames() {
    return ajax.get('/current-games')
  }

  function loadGame(id) {
    return ajax.get(`/game/${id}`)
  }

  return {
    createGame,
    loadCurrentGames,
    loadGame,
  }
};
