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

    shufflePlayerOrder() {
        let p = [];
        for (let i = 0; i < this.players.length; i++) p.push(i);

        return shuffle(p);
    }

    getPlayer(id) { // player, index
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) return [this.players[i], i];
        }

        return [null, -1];
    }

    removePlayer(id) {
        let [p, index] = this.getPlayer(id);
        if (index == -1) return;
        this.players.splice(index, 1);
    }

    notifyPlayers(msg, data, includeOwner=true, blacklist=[]) {
        for (let i = 0; i < this.players.length; i++) {
            let p = this.players[i];
            if (!includeOwner && p.id == this.owner.id) continue;
            if (blacklist.includes(p.id)) continue;

            p.socket.emit(msg, data);
        }
    }

    sanitize(options) {
        let ps = {}; // id, sanitized player
        for (let i = 0; i < this.players.length; i++) {
            let p = this.players[i];
            let pOutput = {};
            if (options != null && p.id in options) pOutput = p.sanitize(options[p.id]);
            else pOutput = p.sanitize();

            ps[p.id] = pOutput;
        }

        return {
            "owner": this.owner.sanitize(),
            "numPlayers": this.players.length,
            "players": ps,
        }
    }
}