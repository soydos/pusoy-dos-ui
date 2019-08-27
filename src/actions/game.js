export const BEGIN_GAME = 'BEGIN_GAME';
export const CREATE_GAME = 'CREATE_GAME';
export const GAME_CREATED = 'GAME_CREATED';
export const REQUEST_LOBBY = 'REQUEST_LOBBY';
export const LOBBY_INFO = 'LOBBY_INFO';

export const beginGame = (decks, jokers, ruleset) => ({
    type: BEGIN_GAME,
    ruleset, decks, jokers
})

export const createGame = (decks, jokers, ruleset) => ({
  type: CREATE_GAME,
  ruleset, decks, jokers
})

export const requestLobby = (id) => ({
  type: REQUEST_LOBBY,
  id
})
