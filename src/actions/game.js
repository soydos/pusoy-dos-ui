export const BEGIN_GAME = 'BEGIN_GAME';

export const beginGame = (decks, jokers, ruleset) => ({
    type: BEGIN_GAME,
    ruleset, decks, jokers
})
