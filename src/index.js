import('wasm-pusoy-dos').then((wasm) => {

    let game, player;
    let hand = [];
    try {
        game = wasm.create_game(["a", "b"]);
        console.log("created game");
        console.log(game);
    } catch(err) {
        console.log("error creating game!");
        console.error(err.message);
    }

    try {
        player = wasm.get_player(game, "a");
        console.log(player);
    } catch (err) {
        console.log("error grabbing player");
        console.error(err);
    }


    let cardContainer = document.getElementById("card-holder");
    let cards = player.map((card) => {
        let c = JSON.stringify(card);
        return `<div data-card='${c}'>
                    ${card.card.rank} - ${card.card.suit.name}
                </div>`;
    }).join('');

    cardContainer.innerHTML = cards;
    cardContainer.addEventListener('click', (ev) => {
        let card = JSON.parse(ev.target.dataset.card);
        card.joker = false;
        hand.push(card);
    });

    let button = document.getElementById("submit-button");
    button.addEventListener('click', ()=>{
        console.log(hand);
        let selectedHand = wasm.get_hand_type(hand);
        console.log(selectedHand);
    });

});
