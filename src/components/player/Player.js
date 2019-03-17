import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { useDragObservable } from '../../hooks/eventHooks';

import Card from '../card/Card';

import css from './Player.sass';

const Player = ({ cards, onSelect }) => {

  const [ selected, setSelected ] = useState([]);
  const [ order, setOrder ] = useState(cards.map(card => card.id));
  const [ draggingLeft, setDraggingLeft ] = useState(0);
  const [ jokerSelect, setJokerSelect ] = useState(undefined);
  const [ jokerValue, setJokerValue ] = useState({rank: 'two', suit: 'spades'});

  const [ cardWidth, setCardWidth ] = useState(0);

  const playerWidth = useRef(0);

  const draggingRef = useRef([]);
  const selectedRef = useRef([]);

  // Need the ref to be able to get and set current value in effect
  // Need state to make react rerender (changing ref doesn't trigger rerender)
  const scrollRef = useRef(0);
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
    setSelected([]);
    setOrder(order.filter(order => cards.some(card => card.id === order)));
  }, [cards]);

  // Selected Card Callback
  useEffect(() => {
    if (onSelect) {
      onSelect(selected);
    }
    selectedRef.current = selected.map(card => card.id);
  }, [selected]);

  // Reorder stuff
  useEffect(() => {
    if (!dragObservables) return;

    const { start$, drag$, end$ } = dragObservables;

    let _dragging = false;
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

      _startX = getOffset(start);
      _lastX = 0;
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

      if (!_dragging) {
        if (selectedRef.current.length) {
          draggingRef.current = selectedRef.current;
          _dragging = true;
        } else {
          updateScroll(getOffset(move) - _startX);
        }
      } else {
        const mouseX = getMouseX(move);
        const cardLeft = Math.min(
          playerWidth.current - (draggingRef.current.length * cardOverlapRef.current + (cardWidth - cardOverlapRef.current)),
          Math.max(
            0,
            mouseX - _startX
          )
        );
        setDraggingLeft(cardLeft);

        // Scroll when dragging card to edges
        const rightThreshold = playerRef.current.offsetWidth - scrollRef.current - (cardWidth * 1.25);
        const leftThreshold = -scrollRef.current + (cardWidth / 2);
        if (_lastX && cardLeft - _lastX > 0 && cardLeft > rightThreshold) {
          updateScroll(Math.floor(rightThreshold - cardLeft));
        } else if (_lastX && cardLeft - _lastX < 0 && cardLeft < leftThreshold) {
          updateScroll(Math.floor(leftThreshold - cardLeft));
        }
        _lastX = cardLeft;
      }
    });
    const endSubscription = end$.subscribe(end => {
      if (_dragging) {
        setSelected([]);
      }
      draggingRef.current = [];
      _dragging = false;
    });

    return () => {
      startSubscription.unsubscribe();
      dragSubscription.unsubscribe();
      endSubscription.unsubscribe();
    };
  },[dragObservables, cards]);

  useEffect(() => {
    let moveIndex = getCardIndex(draggingLeft + (cardOverlapRef.current / 2));
    if (draggingRef.current.length === 0 || moveIndex === order.findIndex(id => id === draggingRef.current[0])) return;

    let newOrder = order.filter(id => !draggingRef.current.includes(id));
    newOrder.splice(moveIndex, 0, ...draggingRef.current);

    setOrder(newOrder);
  }, [draggingLeft]);

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

  function selectCard(card) {
    // make all jokers two of spades (until select feature done)
    // const joker = { rank: 'two', suit: 'spades' };
    // const playedCard = {
    //   ...joker,
    //   ...card,
    //   is_joker: card.type === 'joker'
    // };

    const filteredSelect = selected.filter(selectedCard => selectedCard.id !== card.id);

    // if card wasn't already selected, select it!
    if (filteredSelect.length === selected.length) {
      // joker select
      if (card.type === 'joker') {
        setJokerSelect(card);
        return;
      }

      setSelected([...selected, {...card, is_joker: false}]);
    } else {
      setSelected(filteredSelect);
    }
  }

  if (jokerSelect) {
    const ranks = [
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'jack',
      'queen',
      'king',
      'ace'
    ];
    const suits = [
      'clubs',
      'hearts',
      'diamonds',
      'spades'
    ];
    return (
      <div
        className={css.player}
      >
        <select
          onChange={({target}) => setJokerValue(value => ({...value, rank: target.value}))}
          value={jokerValue.rank}
        >
          {ranks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
        </select>
        <select
          onChange={({target}) => setJokerValue(value => ({...value, suit: target.value}))}
          value={jokerValue.suit}
        >
          {suits.map(suit => <option key={suit} value={suit}>{suit}</option>)}
        </select>
        <button onClick={() => { setSelected([...selected, {id: jokerSelect.id, ...jokerValue, is_joker: true}]); setJokerSelect(undefined); }}>
          OK
        </button>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className={`${css.player} ${draggingRef.current.length ? css.reordering : ''}`}
      style={{
        width: (cards.length * cardOverlapRef.current + (cardWidth - cardOverlapRef.current)) + 'px',
        transform: `translate(${scroll}px)`,
      }}
    >
      {
        cards.map((card, index) => {

          const position = order.findIndex(key => key === card.id);
          const draggingPosition = draggingRef.current.findIndex(key => key === card.id);
          const cardDragging = draggingRef.current.includes(card.id);
          const left = cardDragging ? draggingLeft + (draggingPosition * cardOverlapRef.current) : position * cardOverlapRef.current;

          return (
            <Card
              key={card.id}
              card={card}
              selected={selectedRef.current.includes(card.id)}
              dragging={cardDragging}
              reordering={draggingRef.current.length}
              style={{zIndex: position, left: left + 'px'}}
              onClick={() => selectCard(card)}
            />
          );
        })
      }
    </div>
  );
}

export default Player;
