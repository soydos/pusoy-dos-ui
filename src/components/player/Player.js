import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { useDragObservable } from '../../hooks/eventHooks';

import Card from '../card/Card';

import css from './Player.sass';

const Player = ({ cards, onSelect }) => {

  const [ selected, setSelected ] = useState({});
  const [ order, setOrder ] = useState(cards.map(card => card.id));
  const [ startIndex, setStartIndex ] = useState(0);
  const [ moveIndex, setMoveIndex ] = useState(0);
  const [ dragging, setDragging ] = useState(false);
  const [ dragged, setDragged ] = useState(false);
  const [ draggingLeft, setDraggingLeft ] = useState(0);

  const [ cardWidth, setCardWidth ] = useState(0);
  const [ cardOverlap, setCardOverlap ] = useState(30);

  const [ scrolling, setScrolling ] = useState(0);
  const scroll = useRef(0);

  const playerRef = useRef(null);

  const dragObservables = useDragObservable(playerRef.current);

  const width = cards.length * cardOverlap + (cardWidth - cardOverlap);

   useEffect(() => {
     const width = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'), 10);
     setCardWidth(width);
     // setCardOverlap((document.querySelector('#container').offsetWidth - width) / cards.length);
  }, []);

  useEffect(() => {
    setSelected({});
    setOrder(order.filter(order => cards.some(card => card.id === order)));
  }, [cards]);

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

    let _scroll = 0;
    let _scrolling = 0;

    const getOffset = e => {
      return e.targetTouches && e.targetTouches.length
        ? e.targetTouches[0].pageX - e.target.getBoundingClientRect().left
        : e.offsetX;
    }

    const startSubscription = start$.subscribe(start => {
      if (start.touches && start.touches.length > 1) {
        _scroll = start.touches[0].pageX;
        return;
      }

      _startIndex = getCardIndex(getMouseX(start));
      _startX = getOffset(start);
      setStartIndex(_startIndex);
      setDragged(false);
    });
    const dragSubscription = drag$.subscribe(move => {
      if (move.touches && move.touches.length > 1) {
        _scrolling = move.touches[0].pageX - _scroll;
        setScrolling(_scrolling);
        return;
      }
      const mouseX = getMouseX(move);
      const cardLeft = Math.min(
        width - cardWidth,
        Math.max(
          0,
          mouseX - _startX
        )
      );
      const _moveIndex = getCardIndex(cardLeft + (cardOverlap / 2));
      setDragging(true);
      setDraggingLeft(cardLeft);
      setMoveIndex(_moveIndex);
      if (!dragged && _startIndex !== _moveIndex) {
        setDragged(true);
      }
    });
    const endSubscription = end$.subscribe(end => {
      scroll.current = clampScroll(scroll.current + _scrolling);
      _scrolling = 0;
      setScrolling(_scrolling);
      setDragging(false);
    });

    return () => {
      startSubscription.unsubscribe();
      dragSubscription.unsubscribe();
      endSubscription.unsubscribe();
    };
  },[dragObservables, cards]);

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
    const x = pageX - element.getBoundingClientRect().left;

    return x;
  }

  function getCardIndex(x) {
    return Math.max(0, Math.min(Math.floor(x / cardOverlap), cards.length - 1));
  }

  function clampScroll(scroll) {
    const minScroll = playerRef.current
      ? playerRef.current.parentElement.offsetWidth - playerRef.current.scrollWidth
      : -Infinity;
    return Math.min(0, Math.max(minScroll, scroll));
  }

  function selectCard(card, index) {
    // make all jokers two of spades (until select feature done)
    const joker = { rank: 'two', suit: 'spades' };
    const playedCard = {
      ...joker,
      ...card,
      is_joker: card.type === 'joker'
    };

    if (selected[index]) {
      const filteredSelect = Object.assign({}, ...Object.keys(selected)
        .filter(key => key !== String(index))
        .map(key => ({ [key]: selected[key] }))
      );
      setSelected(filteredSelect);
    } else {
      setSelected({...selected, [index]: playedCard});
    }
  }

  const scrollLeft = clampScroll(scroll.current + scrolling);

  return (
    <div
      ref={playerRef}
      className={css.player}
      style={{
        width: (cards.length * cardOverlap + (cardWidth - cardOverlap)) + 'px',
        transform: `translate(${scrollLeft}px)`,
      }}
    >
      {
        cards.map((card, index) => {

          const position = order.findIndex(key => key === card.id);
          const cardDragging = dragging && position === startIndex;
          const left = cardDragging ? draggingLeft : position * cardOverlap;

          return (
            <Card
              key={card.id}
              card={card}
              selected={selected[card.id] !== undefined}
              dragging={cardDragging}
              style={{zIndex: position, left: left + 'px'}}
              onClick={() => !dragged && selectCard(card, card.id)}
            />
          );
        })
      }
    </div>
  );
}

export default Player;
