export function getHandDescription(move) {
    const type = move.type;
    const hand = move.cards;

    let joker = false;

    switch (type) {
      case 'single':
        joker = hand.is_joker;
        return `${hand.rank} of ${hand.suit}${joker ? ' (Joker)' : ''}`;
        break;
      case 'pair':
      case 'prial':
        joker = hand.some(card => card.is_joker);
        return `${type} of ${hand[0].rank}${hand[0].rank === 'six' ? 'es' : 's'}${joker ? ' (Joker)' : ''}`;
        break;
      case 'fivecardtrick':
        switch (hand.trick_type) {
          case 'flush':
            joker = hand.cards.some(card => card.is_joker);
            return `${hand.cards[0].suit} flush${joker ? ' (Joker)' : ''}`;
            break;
          case 'fullhouse':
            joker = hand.cards.some(card => card.is_joker);
            return `Full House${joker ? ' (Joker)' : ''}`;
            break;
          case 'fourofakind':
            joker = hand.cards.some(card => card.is_joker);
            return `Four of a Kind${joker ? ' (Joker)' : ''}`;
            break;
          default:
            joker = hand.cards.some(card => card.is_joker);
            return `${type}${joker ? ' (Joker)' : ''}`;
            break;
        }
        break;
      default:
        return type;
    }
}

