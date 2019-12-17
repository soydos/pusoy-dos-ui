import { GAME_LOADED } from '../actions/game';

export default function (state = {gameLoaded:false}, action) {
  switch (action.type) {
    case GAME_LOADED:
      return {
        ...state,
        gameLoaded: true,
        created: action.data.created_user,
        inGame: action.data.in_game,
        users: action.data.users,
        status: action.data.status,
        cards: action.data.hand,
        lastMove: action.data.last_move,
        nextPlayer: action.data.next_player,
        ruleset: action.data.ruleset,
        decks: action.data.decks,
        jokers: action.data.jokers,
        winners: action.data.winners,
        suitOrder: action.data.suit_order,
    }
    default:
      return state;
  }
}
