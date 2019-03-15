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

  const playerWidth = useRef(0);

  // Need the ref to be able to get and set current value in effect
  const scrollRef = useRef(0);
  // Need state to make react rerender (changing ref doesn't trigger rerender)
  const [ scroll, setScroll] = useState(0);

  const cardOverlapRef = useRef(30);
  const [ cardOverlap, setCardOverlap ] = useState(30);

  const playerRef = useRef(null);

  const dragObservables = useDragObservable(playerRef.current);

   useEffect(() => {
     const width = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'), 10);
     setCardWidth(width);
     cardOverlapRef.current = (document.querySelector('#container').offsetWidth - width) / cards.length;
     setCardOverlap(cardOverlapRef.current);
     playerWidth.current = cards.length * cardOverlapRef.current + (width - cardOverlapRef.current);
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
    let _lastX = 0;

    let _lastTouches = [];

    const getOffset = e => {
      return e.targetTouches && e.targetTouches.length
        ? e.targetTouches[0].pageX - e.target.getBoundingClientRect().left
        : e.offsetX;
    }

    const updateScroll = scrolled  => {
      scrollRef.current = clampScroll(scrollRef.current + scrolled);
      setScroll(scrollRef.current);
    }

    const getGesture = (touches, lastTouches) => {
      if (touches.length > 1 && lastTouches.length > 1) {
        let point1 = -1;
        let point2 = -1;

        for (let i = 0; i < lastTouches.length; i++) {
          if (lastTouches[i].identifier === touches[0].identifier) { point1 = i; }
          if (lastTouches[i].identifier === touches[1].identifier) { point2 = i; }
        }

        if (point1 >= 0 && point2 >= 0) {
          const touchOneChange = touches[0].pageX - lastTouches[point1].pageX;
          const touchTwoChange = touches[1].pageX - lastTouches[point2].pageX;

          // check if swipe
          if (touchOneChange * touchTwoChange > 0) {
            return { type: "swipe", value: touches[0].pageX - lastTouches[point1].pageX };
          }

          const diff1 = Math.abs(touches[1].pageX - touches[0].pageX);
          const diff2 = Math.abs(lastTouches[point2].pageX - lastTouches[point1].pageX);

          if (Math.abs(diff1 - diff2) > 1 && diff1 !== diff2) {
            return { type: "pinch", value: (diff1 - diff2) / 7 };
          }

          return { type: "none" };
        }
      }
    }

    const startSubscription = start$.subscribe(start => {
      if (start.touches && start.touches.length > 1) {
        start.preventDefault();
        _lastTouches = start.touches;
        return;
      }

      _startIndex = getCardIndex(start.target.getBoundingClientRect().left - playerRef.current.getBoundingClientRect().left);
      _startX = getOffset(start);
      _lastX = 0;
      setStartIndex(_startIndex);
      setDragged(false);
    });
    const dragSubscription = drag$.subscribe(move => {
      if (move.touches && move.touches.length > 1) {
        move.preventDefault();
        const gesture = getGesture(move.touches, _lastTouches);
        switch (gesture.type) {
          case "swipe":
            updateScroll(gesture.value);
            break;
          case "pinch":
            cardOverlapRef.current = Math.max((document.querySelector('#container').offsetWidth - cardWidth) / cards.length, Math.min(cardWidth, cardOverlapRef.current + gesture.value));
            playerWidth.current = cards.length * cardOverlapRef.current + (cardWidth - cardOverlapRef.current);
            setCardOverlap(cardOverlapRef.current);
            updateScroll(0);
          default:
            break;
        }
        _lastTouches = [...move.touches];
        return;
      }
      const mouseX = getMouseX(move);
      const cardLeft = Math.min(
        playerWidth.current - cardWidth,
        Math.max(
          0,
          mouseX - _startX
        )
      );
      const _moveIndex = getCardIndex(cardLeft + (cardOverlapRef.current / 2));
      setDragging(true);
      setDraggingLeft(cardLeft);
      setMoveIndex(_moveIndex);

      // Scroll when dragging card to edges
      const rightThreshold = playerRef.current.offsetWidth - scrollRef.current - (cardWidth * 1.25);
      const leftThreshold = -scrollRef.current + (cardWidth / 2);
      if (_lastX && cardLeft - _lastX > 0 && cardLeft > rightThreshold) {
        updateScroll(Math.floor(rightThreshold - cardLeft));
      } else if (_lastX && cardLeft - _lastX < 0 && cardLeft < leftThreshold) {
        updateScroll(Math.floor(leftThreshold - cardLeft));
      }
      _lastX = cardLeft;

      if (!dragged && _startIndex !== _moveIndex) {
        setDragged(true);
      }
    });
    const endSubscription = end$.subscribe(end => {
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
    return Math.max(0, Math.min(Math.floor(x / cardOverlapRef.current), cards.length - 1));
  }

  function clampScroll(scroll) {
    const minScroll = playerRef.current
      ? playerRef.current.parentElement.offsetWidth - (cards.length * cardOverlapRef.current + (cardWidth - cardOverlapRef.current))
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

  return (
    <div
      ref={playerRef}
      className={`${css.player} ${dragging ? css.reordering : ''}`}
      style={{
        width: (cards.length * cardOverlapRef.current + (cardWidth - cardOverlapRef.current)) + 'px',
        transform: `translate(${scroll}px)`,
      }}
    >
      {
        cards.map((card, index) => {

          const position = order.findIndex(key => key === card.id);
          const cardDragging = dragging && position === startIndex;
          const left = cardDragging ? draggingLeft : position * cardOverlapRef.current;

          return (
            <Card
              key={card.id}
              card={card}
              selected={selected[card.id] !== undefined}
              dragging={cardDragging}
              reordering={dragging}
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
