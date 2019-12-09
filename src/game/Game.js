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

  function deal(id) {
    return ajax.post(`/game/deal/${id}`)
  }

  function submitMove(id, selectedCards) {
    return ajax.post(`/game/${id}`)
  }

  return {
    createGame,
    loadCurrentGames,
    loadGame,
    joinGame,
    deal,
    submitMove,
  }
};
