import React from 'react';

import css from './Card.sass';

const Card = ({ card, back, style, onClick, selected, dragging }) => {

  const cardClassName = [
    css.card,
    back && css.back,
    selected && css.selected,
    dragging && css.dragging,
  ].filter(c => c).join(' ');

  const faceClassName = [
    css.graphic,
    card && css[card.standard[0]],
    card && css[card.standard[1]],
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
