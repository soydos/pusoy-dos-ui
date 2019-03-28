import clubs2img from '../assets/images/cards/card-clubs-2.svg';
import clubs3img from '../assets/images/cards/card-clubs-3.svg';
import clubs4img from '../assets/images/cards/card-clubs-4.svg';
import clubs5img from '../assets/images/cards/card-clubs-5.svg';
import clubs6img from '../assets/images/cards/card-clubs-6.svg';
import clubs7img from '../assets/images/cards/card-clubs-7.svg';
import clubs8img from '../assets/images/cards/card-clubs-8.svg';
import clubs9img from '../assets/images/cards/card-clubs-9.svg';
import clubs10img from '../assets/images/cards/card-clubs-10.svg';
import clubsjimg from '../assets/images/cards/card-clubs-j.svg';
import clubsqimg from '../assets/images/cards/card-clubs-q.svg';
import clubskimg from '../assets/images/cards/card-clubs-k.svg';
import clubsaimg from '../assets/images/cards/card-clubs-a.svg';
import diamonds2img from '../assets/images/cards/card-diamonds-2.svg';
import diamonds3img from '../assets/images/cards/card-diamonds-3.svg';
import diamonds4img from '../assets/images/cards/card-diamonds-4.svg';
import diamonds5img from '../assets/images/cards/card-diamonds-5.svg';
import diamonds6img from '../assets/images/cards/card-diamonds-6.svg';
import diamonds7img from '../assets/images/cards/card-diamonds-7.svg';
import diamonds8img from '../assets/images/cards/card-diamonds-8.svg';
import diamonds9img from '../assets/images/cards/card-diamonds-9.svg';
import diamonds10img from '../assets/images/cards/card-diamonds-10.svg';
import diamondsjimg from '../assets/images/cards/card-diamonds-j.svg';
import diamondsqimg from '../assets/images/cards/card-diamonds-q.svg';
import diamondskimg from '../assets/images/cards/card-diamonds-k.svg';
import diamondsaimg from '../assets/images/cards/card-diamonds-a.svg';
import hearts2img from '../assets/images/cards/card-hearts-2.svg';
import hearts3img from '../assets/images/cards/card-hearts-3.svg';
import hearts4img from '../assets/images/cards/card-hearts-4.svg';
import hearts5img from '../assets/images/cards/card-hearts-5.svg';
import hearts6img from '../assets/images/cards/card-hearts-6.svg';
import hearts7img from '../assets/images/cards/card-hearts-7.svg';
import hearts8img from '../assets/images/cards/card-hearts-8.svg';
import hearts9img from '../assets/images/cards/card-hearts-9.svg';
import hearts10img from '../assets/images/cards/card-hearts-10.svg';
import heartsjimg from '../assets/images/cards/card-hearts-j.svg';
import heartsqimg from '../assets/images/cards/card-hearts-q.svg';
import heartskimg from '../assets/images/cards/card-hearts-k.svg';
import heartsaimg from '../assets/images/cards/card-hearts-a.svg';
import spades2img from '../assets/images/cards/card-spades-2.svg';
import spades3img from '../assets/images/cards/card-spades-3.svg';
import spades4img from '../assets/images/cards/card-spades-4.svg';
import spades5img from '../assets/images/cards/card-spades-5.svg';
import spades6img from '../assets/images/cards/card-spades-6.svg';
import spades7img from '../assets/images/cards/card-spades-7.svg';
import spades8img from '../assets/images/cards/card-spades-8.svg';
import spades9img from '../assets/images/cards/card-spades-9.svg';
import spades10img from '../assets/images/cards/card-spades-10.svg';
import spadesjimg from '../assets/images/cards/card-spades-j.svg';
import spadesqimg from '../assets/images/cards/card-spades-q.svg';
import spadeskimg from '../assets/images/cards/card-spades-k.svg';
import spadesaimg from '../assets/images/cards/card-spades-a.svg';
import jokerimg from '../assets/images/cards/card-joker-1.svg';
import backimg from '../assets/images/cards/card-back.svg';

const images = [
    clubs2img,
    clubs3img,
    clubs4img,
    clubs5img,
    clubs6img,
    clubs7img,
    clubs8img,
    clubs9img,
    clubs10img,
    clubsjimg,
    clubsqimg,
    clubskimg,
    clubsaimg,
    diamonds2img,
    diamonds3img,
    diamonds4img,
    diamonds5img,
    diamonds6img,
    diamonds7img,
    diamonds8img,
    diamonds9img,
    diamonds10img,
    diamondsjimg,
    diamondsqimg,
    diamondskimg,
    diamondsaimg,
    hearts2img,
    hearts3img,
    hearts4img,
    hearts5img,
    hearts6img,
    hearts7img,
    hearts8img,
    hearts9img,
    hearts10img,
    heartsjimg,
    heartsqimg,
    heartskimg,
    heartsaimg,
    spades2img,
    spades3img,
    spades4img,
    spades5img,
    spades6img,
    spades7img,
    spades8img,
    spades9img,
    spades10img,
    spadesjimg,
    spadesqimg,
    spadeskimg,
    spadesaimg,
    jokerimg,
    backimg,
];

export default () => {
    images.forEach(img => { new Image().src = img });
};
