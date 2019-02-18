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
            <div className="cards">{ this.displayCards() }</div>
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
                        className={`card ${cardSelected ? 'selected' : '' }`}
                    >
                      <div className={`face rank-${card.card.rank} suit-${card.card.suit.name}`}></div>
            </div>;
        });
    }
    displayMove() {

        let selectedMessage = 'Invalid hand!';
        if(this.state.select) {
            let selectedHand = this.wasm.get_hand_type(
                Object.values(this.state.select)
            );
            console.log(selectedHand);


            if(selectedHand){
                switch(selectedHand.type) {
                    case 'single':
                        selectedMessage = `${
                            selectedHand.cards.card.rank
                        } of ${
                            selectedHand.cards.card.suit.name
                        }`;
                        break;
                    case 'pair':
                    case 'prial':
                        selectedMessage = `${
                            selectedHand.type
                        } of ${
                            selectedHand.cards[0].card.rank
                        }s`;
                        break;
                    case 'fivecardtrick':
                        switch(selectedHand.cards.trick_type) {
                            case 'Flush':
                                selectedMessage = `${
                                    selectedHand.cards.cards[0].card.suit.name
                                } flush`;
                                break;
                            case 'FullHouse':
                                selectedMessage = 'Full House';
                                break;
                            default:
                                selectedMessage = selectedHand.cards.trick_type;
                                break;
                        }
                        break;
                    default:
                        selectedMessage = selectedHand.type;
                }

            }
        }

        return <span>{ selectedMessage }</span>;

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
