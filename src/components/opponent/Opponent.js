import React, { useState, useEffect } from 'react';

import Card from '../card/Card';

import css from './Opponent.sass';

/*
 * Not too happy about these hardcoded sizes of cards in here
 */

const Opponent = ({ cards, vertical }) => {
  const cardOverlap = { horizontal: 20, vertical: 10 };

  const [ cardSize, setCardSize ] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const width = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'), 10);
    const height = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-height'), 10);

    setCardSize({ width, height });
  }, []);

  const dimension = vertical
    ? {width: cardSize.width + 'px', height: (cards.length * cardOverlap.vertical + (cardSize.height - cardOverlap.vertical)) + 'px'}
    : {width: (cards.length * cardOverlap.horizontal + (cardSize.width - cardOverlap.horizontal)) + 'px', height: cardSize.height + 'px'};

  return (
    <div
      className={css.opponent}
      style={{...dimension}}
    >
      {
        cards.map(index => {
          const position = vertical
            ? {top: (index * cardOverlap.vertical) + 'px'}
            : {left: (index * cardOverlap.horizontal) + 'px'};

          return (
            <Card
              key={index}
              back={true}
              style={position}
            />
          );
        })
      }
    </div>
  );
}

export default Opponent;

