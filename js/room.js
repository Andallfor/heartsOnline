import { shuffle } from './util.js';

export class room {
    constructor(id, owner) {
        this.id = id;
        this.players = [owner];
        this.owner = owner;

        this.phase = phases.starting;
    }

    shufflePlayerOrder() {
        let p = [];
        for (let i = 0; i < this.players.length; i++) p.push(i);
        p = shuffle(p);
        for (let i = 0; i < this.players.length; i++) this.players[i].order = p[i];

        //this.players.sort((a, b) => {return a.order - b.order;});
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

export const phases = {
    starting: 0,
    distribute: 1,
    play: 2,
    end: 3
}