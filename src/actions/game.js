export const BEGIN_GAME = 'BEGIN_GAME';
export const CREATE_GAME = 'CREATE_GAME';
export const GAME_CREATED = 'GAME_CREATED';
export const LOAD_GAME = 'LOAD_GAME';
export const GAME_LOADED = 'GAME_LOADED';
export const JOIN_GAME = 'JOIN_GAME';
export const GAME_JOINED = 'GAME_JOINED';
export const DEAL_GAME = 'DEAL_GAME';
export const DEAL_COMPLETE = 'DEAL_COMPLETE';
export const SUBMIT_MOVE = 'SUBMIT_MOVE';

export const beginGame = (decks, jokers, ruleset) => ({
    type: BEGIN_GAME,
    ruleset, decks, jokers
})

export const createGame = (decks, jokers, ruleset) => ({
  type: CREATE_GAME,
  ruleset, decks, jokers
})

