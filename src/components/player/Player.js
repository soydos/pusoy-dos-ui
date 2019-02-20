import React, { useState, useEffect } from 'react';

import Card from '../card/Card';

import css from './Player.sass';

const Player = ({ cards, onSelect }) => {
  const [ selected, setSelected ] = useState({});

  // Selected Card Callback
  useEffect(() => {
    if (onSelect) {
      onSelect(Object.values(selected));
    }
  }, [selected]);

  function selectCard(card, index) {
    card.joker = false;
    if (selected[index]) {
      const filteredSelect = Object.assign({}, ...Object.keys(selected)
        .filter(key => key !== String(index))
        .map(key => ({ [key]: selected[key] }))
      );
      setSelected(filteredSelect);
    } else {
      setSelected({...selected, [index]: card});
    }
  }

  return (
    <div
      className={css.player}
      style={{width: (cards.length * 30 + 85) + 'px'}}
    >
      {
        cards.map((card, index) =>
          <Card
            key={index}
            card={card.card}
            selected={selected[index] !== undefined}
            style={{left: (index * 30) + 'px'}}
            onClick={() => selectCard(card, index)}
          />)
      }
    </div>
  );
}

export default Player;
