import React from 'react';
import { Link } from "react-router-dom";
import css from './SuggestedMove.sass';
import Card from '../card/Card';

const SuggestedMove = ({
    lastMove,
    lastMoveType,
    suggestedMove,
    close
}) => {
    const overlap = 30;
    function getCards() {
        const cards = suggestedMove.map((card, index) => {
            const style = { left : index * overlap + 'px' };
            return (<Card
              card={card}
              style={style}
              key={index}
            />);
        });

        if(cards.length > 0){
            return cards;
        } else {
            return 'PASS';
        }
    }

    let explanation = '';
    if(lastMove == 'pass') {
        explanation = (<div>It's your move on an empty table</div>);
    } else if(lastMove) {
        explanation = (<div>
            <div>Move to beat is {lastMove}.</div>
             <div>
                You need to play a {lastMoveType} of greater value
             </div>
        </div>);
    } else {
        explanation = (<div>The game is always started 
            by the player with the Three of Clubs</div>);
    }

    return (<div className={css.suggestedMove}>
        <div className={css.close} onClick={close}>x</div>
        { explanation }
        <div>
            <p><Link to="/about">See complete rules.</Link></p>
        </div>
        <div>
            Suggested Move:
            <div className={css.suggestedHand}>
            { getCards() }
            </div>
        </div>
    </div>);
};

export default SuggestedMove;
