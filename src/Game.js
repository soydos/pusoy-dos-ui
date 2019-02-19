import React, { useState, useEffect, useRef } from 'react';

const Game = () => {
  // Just hardcode for now
  const players = [
    'player',
    'cpu1',
    'cpu2',
    'cpu3',
  ];

  // State
  const [ loaded, setLoaded ] = useState(false);
  const [ dealed, setDealed ] = useState(false);
  const [ select, setSelect ] = useState({});
  const [ selectedHand, setSelectedHand ] = useState('Pass');

  // WASM instance, available at wasm.current
  const wasmRef = useRef(null);

  // GAME instance, available at game.current
  const gameRef = useRef(null);

  // Load WASM library
  useEffect(() => {
    import('wasm-pusoy-dos').then(wasm => {
      wasmRef.current = wasm;
      setLoaded(true);
    });
  }, []);

  // Get Move Label
  useEffect(() => {
    const move = wasmRef.current &&
      wasmRef.current.get_hand_type(Object.values(select)) ||
      {type: 'Invalid Hand'};

    switch (move.type) {
      case 'single':
        setSelectedHand(`${move.cards.card.rank} of ${move.cards.card.suit.name}`);
        break;
      case 'pair':
      case 'prail':
        setSelectedHand(`${move.type} of ${move.cards[0].card.rank}`);
        break;
      case 'fivecardtrick':
        switch (move.cards.trick_type) {
          case 'Flush':
            setSelectedHand(`${move.cards.cards[0].card.suit.name} flush`);
            break;
          case 'FullHouse':
            setSelectedHand(`Full House`);
            break;
          default:
            setSelectedHand(move.cards.trick_type);
            break;
        }
        break;
      default:
        setSelectedHand(move.type);
    }
  }, [select, wasmRef.current]);

  // Functions/Callbacks
  function onDeal() {
    gameRef.current = wasmRef.current.create_game(players);
    setDealed(true);
  }

  function getHiddenCards(player) {
    return wasmRef.current.get_player(gameRef.current, player).map((_, index) =>
      <div className='hidden-card' key={ index } />
    );
  }

  function getPlayerCards() {
    const cards = wasmRef.current.get_player(gameRef.current, 'player');

    return cards.map((card, index) =>
      <div
        className={ `card ${select[index] ? 'selected' : ''}` }
        key={ index }
        onClick={() => selectCard(index, card)}
      >
        <div className={ `face rank-${card.card.rank} suit-${card.card.suit.name}` } />
      </div>
    );
  }

  function selectCard(index, card) {
    card.joker = false;
    if (select[index]) {
      const filteredSelect = Object.assign({}, ...Object.keys(select)
        .filter(key => key !== String(index))
        .map(key => ({ [key]: select[key] }))
      );
      setSelect(filteredSelect);
    } else {
      setSelect({...select, [index]: card});
    }
  }

  // HTML parts, could be split into own components
  const table = dealed ? (
    <>
      <div className='game'>
          <div className='opponent-cards'>
            <div className='cpu2-cards hidden-card-set'>
                { getHiddenCards('cpu2') }
            </div>
            <div className='cpu1-cards hidden-card-set left-panel'>
                { getHiddenCards('cpu1') }
            </div>
            <div className='cpu3-cards hidden-card-set right-panel'>
                { getHiddenCards('cpu3') }
            </div>
          </div>
          <div className='player-cards'>
            { getPlayerCards() }
          </div>
          <div>{ selectedHand }</div>
      </div>
    </>
  ) : (
    <button onClick={onDeal}>Deal!</button>
  );

  return loaded ? (
    <div>
      <h2>Pusoy Dos</h2>
      { table }
    </div>
  ) : (
    <h1>Loading</h1>
  );
}

export default Game;
