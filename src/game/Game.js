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

  function joinGame(id) {
    return ajax.post(`/game/join/${id}`)
  }

  return {
    createGame,
    loadCurrentGames,
    loadGame,
    joinGame
  }
};
