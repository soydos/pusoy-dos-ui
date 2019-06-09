export default () => {
  function createGame(description) {
    console.log(description);
    return Promise.resolve();
  }

  return {
    createGame,
  }
};
