import React from 'react';

import css from './Card.sass';

const Card = ({ card, back, style, onClick, selected, dragging, reordering }) => {

  const cardClassName = [
    css.card,
    back && css.back,
    selected && css.selected,
    dragging && css.dragging,
    reordering && css.reordering,
  ].filter(c => c).join(' ');

  const faceClassName = [
    css.graphic,
    card && css[card.rank],
    card && css[card.suit],
    card && card.type === 'joker' && css.joker,
  ].filter(c => c).join(' ');

  return (
    <div
      style={style}
      className={cardClassName}
      onClick={onClick}
    >
      <div className={faceClassName} />
    </div>
  )
};

export default Card;
