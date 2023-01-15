import { shuffle } from './util.js';
import { dealCards } from './cardUtil.js';

export class room {
    constructor(id, owner) {
        this.id = id;
        this.players = [owner];
        this.owner = owner;
        this.sortedPlayers = [];
    }

    start() {
        // determine playing order and deal cards
        this.sortedPlayers.length = this.players.length;
        let dealtCards = dealCards(this.players.length);
        let order = this.shufflePlayerOrder();

        for (let i = 0; i < this,players.length; i++) {
            this.players[i].order = order[i];
            this.sortedPlayers[order[i]] = this.players[i];
            this.players[i].cards = dealtCards[i];
        }
    }

    registerPlayer(id, nickname) {
        this.players.push(id, nickname);
    }

    shufflePlayerOrder() {
        let p = [];
        for (let i = 0; i < this.players.length; i++) p.push(i);

        return shuffle(p);
    }
}