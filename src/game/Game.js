export default (ajax) => {
  async function createGame(description) {
    return await ajax.post('/game', description)
  }

  return {
    createGame,
  }
};
