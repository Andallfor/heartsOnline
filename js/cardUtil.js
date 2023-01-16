import { shuffle } from './util.js';
import { getCardId } from './cardInfo.js';

export const totalNumCards = 52;

export function getAllCardsRandom() {
    let cards = [];
    for (let suit = 0; suit <= 3; suit++) {
        for (let card = 1; card <= 13; card++) {
            cards.push(getCardId(suit, card));
        }
    }

    return shuffle(cards);
}

export function dealCards(numPlayers) {
    let cards = getAllCardsRandom();
    let cardsPerPlayer = Math.round(totalNumCards / numPlayers);

    let output = [];

    for (let i = 0; i < numPlayers; i++) {
        if (i == numPlayers - 1) output.push(cards.slice(cardsPerPlayer * i));
        else output.push(cards.slice(cardsPerPlayer * i, cardsPerPlayer * (i + 1)));
    }

    return output;
}