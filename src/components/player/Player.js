import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { useDragObservable } from '../../hooks/eventHooks';

import Card from '../card/Card';

import css from './Player.sass';

const Player = ({ cards, onSelect }) => {
  const [ selected, setSelected ] = useState({});
  const [ order, setOrder ] = useState(cards.map((_, index) => index));
  const [ startIndex, setStartIndex ] = useState(0);
  const [ moveIndex, setMoveIndex ] = useState(0);
  const [ dragging, setDragging ] = useState(false);
  const [ dragged, setDragged ] = useState(false);
  const [ draggingLeft, setDraggingLeft ] = useState(0);

  const playerRef = useRef(null);

  const dragObservables = useDragObservable(playerRef.current);

  const width = cards.length * 30 + 85;

  // Selected Card Callback
  useEffect(() => {
    if (onSelect) {
      onSelect(Object.values(selected));
    }
  }, [selected]);

  // Reorder stuff
  useEffect(() => {
    if (!dragObservables) return;

    const { start$, drag$, end$ } = dragObservables;

    let _startIndex = 0;
    let _startX = 0;

    const getOffset = e => {
      return e.targetTouches && e.targetTouches.length
        ? e.targetTouches[0].pageX - e.target.getBoundingClientRect().left
        : e.offsetX;
    }

    const startSubscription = start$.subscribe(start => {
      _startIndex = getCardIndex(getMouseX(start));
      _startX = getOffset(start);
      setStartIndex(_startIndex);
      setDragged(false);
    });
    const dragSubscription = drag$.subscribe(move => {
      const mouseX = getMouseX(move);
      const cardLeft = Math.min(
        width - 115,
        Math.max(
          0,
          mouseX - _startX
        )
      );
      const _moveIndex = getCardIndex(cardLeft + 15);
      setDragging(true);
      setDraggingLeft(cardLeft);
      setMoveIndex(_moveIndex);
      if (!dragged && _startIndex !== _moveIndex) {
        setDragged(true);
      }
    });
    const endSubscription = end$.subscribe(() => setDragging(false));

    return () => {
      startSubscription.unsubscribe();
      dragSubscription.unsubscribe();
      endSubscription.unsubscribe();
    };
  },[dragObservables]);

  useEffect(() => {
    let newOrder = [...order];
    newOrder.splice(moveIndex, 0, newOrder.splice(startIndex, 1)[0]);
    setOrder(newOrder);
    setStartIndex(moveIndex);
  }, [moveIndex]);

  function getMouseX(e) {
    const element = e.currentTarget;
    const pageX = e.touches && e.touches.length
      ? e.touches[0].pageX
      : e.pageX;
    const x = pageX - element.offsetLeft;

    return x;
  }

  function getCardIndex(x) {
    return Math.max(0, Math.min(Math.floor(x / 30), cards.length - 1));
  }

  function selectCard(card, index) {
    card = {rank: card.standard[0], suit: card.standard[1], is_joker: false};
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
      ref={playerRef}
      className={css.player}
      style={{width: (cards.length * 30 + 85) + 'px'}}
    >
      {
        cards.map((card, index) => {

          const position = order.findIndex(orderIndex => orderIndex === index);
          const cardDragging = dragging && position === startIndex;
          const left = cardDragging ? draggingLeft : position * 30;

          return (
            <Card
              key={index}
              card={card}
              selected={selected[index] !== undefined}
              dragging={cardDragging}
              style={{zIndex: position, left: left + 'px'}}
              onClick={() => !dragged && selectCard(card, index)}
            />
          );
        })
      }
    </div>
  );
}

export default Player;
