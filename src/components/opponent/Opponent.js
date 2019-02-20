import React, { useState } from 'react';

import Card from '../card/Card';

import css from './Opponent.sass';

/*
 * Not too happy about these hardcoded sizes of cards in here
 */

const Opponent = ({ cards, vertical }) => {
  const dimension = vertical
    ? {width: "115px", height: (cards.length * 10 + 160) + 'px'}
    : {width: (cards.length * 20 + 95) + 'px', height: "170px"};

  return (
    <div
      className={css.opponent}
      style={{...dimension}}
    >
      {
        cards.map(index => {
          const position = vertical
            ? {top: (index * 10) + 'px'}
            : {left: (index * 20) + 'px'};

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

