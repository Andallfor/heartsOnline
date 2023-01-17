import { player, sanitizedPlayer } from './playerInfo.js';
import { shuffle } from './util.js';

export class room {
    id: string;
    players: Array<player>;
    owner: player;
    phase: phases;

    constructor(id: string, owner: player) {
        this.id = id;
        this.players = [owner];
        this.owner = owner;

        this.phase = phases.starting;
    }

    shufflePlayerOrder() {
        let p: Array<number> = [];
        for (let i = 0; i < this.players.length; i++) p.push(i);
        p = shuffle(p);
        for (let i = 0; i < this.players.length; i++) this.players[i].order = p[i];
    }

    getPlayer(id: string) : [player | null, number] { // player, index
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) return [this.players[i], i];
        }

        return [null, -1];
    }

    removePlayer(id: string) {
        let [p, index] = this.getPlayer(id);
        if (index == -1) return;
        this.players.splice(index, 1);
    }

    notifyPlayers(msg: string, data: any=null, includeOwner=true, blacklist: Array<string>=[]) {
        for (let i = 0; i < this.players.length; i++) {
            let p = this.players[i];
            if (!includeOwner && p.id == this.owner.id) continue;
            if (blacklist.includes(p.id)) continue;

            p.socket.emit(msg, data);
        }
    }

    sanitize(options: { [id: string ] : any }={}) : sanitizedRoom {
        let ps: Record<string, sanitizedPlayer> = {}; // id, sanitized player
        for (let i = 0; i < this.players.length; i++) {
            let p = this.players[i];
            let pOutput: sanitizedPlayer;
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

export enum phases {
    starting = 0,
    distribute = 1,
    play = 2,
    end = 3
}

export type sanitizedRoom = {
    owner: sanitizedPlayer,
    numPlayers: number,
    players: Record<string, sanitizedPlayer>
}
