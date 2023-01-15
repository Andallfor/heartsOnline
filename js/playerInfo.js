import { getCardId } from './cardInfo.js';

export class player {
    constructor(id, nickname, socket) {
        this.id = id;
        this.nickname = nickname;
        this.socket = socket;
        
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

    sanitize(allowSelfCards=false) {
        let c = [];
        if (allowSelfCards) c = this.cards;
        else for (let i = 0; i < this.cards.length; i++) c.push(0);

        return {
            "cards": c,
            "damage": this.damage,
            "order": this.order,
            "id": this.id,
            "nickname": this.nickname
        };
    }
}
