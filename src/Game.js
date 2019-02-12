import React, { Component} from "react";

class Game extends Component {
    constructor() {
        super();

        let o = this;
        this.state = {
            loaded: false,
            dealt: false,
            select: {},
            move: null,
        };
        import('wasm-pusoy-dos').then(wasm => {
            o.wasm = wasm;
            o.setState({loaded: true});
        });
    }
    render() {
        if (!this.state.loaded) {
            return <h1>Loading</h1>;
        } else {
            return (
                <div>
                    <h2>Cards</h2>
                    { this.getTable() }
                </div>
            )
        }
    }
    getTable() {
        if(this.state.dealt) {
            return (
                <div>
                    { this.displayGame() }
                </div>
            );
        } else {
            return <button onClick={this.deal.bind(this)}>deal!</button>
        }
    }
    deal() {
        this.game = this.wasm.create_game(
            ["player", "cpu1", "cpu2", "cpu3"]
        );
        this.setState({dealt: true});
    }
    displayGame() {
        return <div>
            <div>{ this.displayCards() }</div>
            <div>{ this.displayMove() }</div>
        </div>;
    }
    displayCards() {
        let player = this.wasm.get_player(this.game, "player");
        let i = 0;
        let select = this.select.bind(this);
        let selected = this.state.select;
        return player.map(card => {
            i++;
            let cardSelected = selected[i];
            let staticIndex = i;
            return <div id={`card-${i}`} 
                        onClick={(e)=>{select(staticIndex, card)}}
                        className={cardSelected ? 'selected' : '' }
                    >
                {card.card.rank} - {card.card.suit.name}
            </div>;
        });
    }
    displayMove() {

        if(this.state.select) {
            let selectedHand = this.wasm.get_hand_type(
                Object.values(this.state.select)
            );

            if(selectedHand){
                return <span> { selectedHand.type } </span>;
            }
        }

        return 'No hand selected';

    }
    select(i, card) {
        let selected = this.state.select;
        card.joker = false;
        if(selected[i]) {
            delete selected[i];
        } else {
            selected[i] = card;
        }
        this.setState({select: selected});
    }
}

export default Game;
