import { getCardId } from './cardInfo.js';

export class player {
    constructor(id, nickname) {
        this.id = id;
        this.nickname = nickname;
        
        this.order = 0;

        this.cards = [];
        this.damage = [];
    }

    addCard(suit, number) {
        let id = getCardId(suit, number)
        this.cards.push(id);
    }

    addCard(id) {
        this.cards.push(id);
    }

    hasCard(suit, number) {
        let id = getCardId(suit, number)
        return this.cards.includes(id);
    }

    hasCard(id) {
        return this.cards.includes(id);
    }
}
