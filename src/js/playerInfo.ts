export {}

import { Socket } from 'socket.io-client';
import { cardID, getCardId, numbers, suits } from './cardInfo.js';
import { room } from './room.js';

export class player {
    id: string;
    nickname: string;
    socket: Socket;
    currentRoom: room | null;
    order: number;
    cards: Array<cardID>;
    damage: Array<cardID>;

    constructor(id: string, nickname: string, socket: Socket) {
        this.id = id;
        this.nickname = nickname;
        this.socket = socket;
        this.currentRoom = null;
        
        this.order = 0;

        this.cards = [];
        this.damage = [];
    }

    // stupid ts doesn't allow duplicate functions
    addCardVerbose(suit: suits, number: numbers) {
        let id = getCardId(suit, number)
        this.cards.push(id);
    }

    addCardID(id: number) {
        this.cards.push(id);
    }

    hasCardVerbose(suit: suits, number: numbers) {
        let id = getCardId(suit, number)
        return this.cards.includes(id);
    }

    hasCardID(id: number) {
        return this.cards.includes(id);
    }

    sanitize(allowSelfCards=false) : sanitizedPlayer {
        let c: Array<cardID> = [];
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

export type sanitizedPlayer = {
    cards: cardID[],
    damage: cardID[],
    order: number,
    id: string,
    nickname: string
}
