"use strict";

// to run: npx tsc; copy src/styles.css dist/styles.css; xcopy src\assets dist\assets /e /h /c /i /q /y; node dist/index.js

// i hate js
import { room, phases } from './js/room.js';
import { player } from './js/playerInfo.js';
import { dealCards } from './js/cardUtil.js';
import { Socket } from 'socket.io-client';
import { createRequire } from "module";
import * as path from "path";

const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http);

app.use(express.static('dist'));
app.get('/', (req: any, res: any) => {res.sendFile(path.resolve('./src/index.html'));});

const rooms: Record<string, room> = {} // key is room id, value is room class
const players: Record<string, player> = {} // playerId, player class

const activeRooms: Record<string, room> = {}

io.on('connection', (socket: Socket) => {
	// create new player instance
	players[socket.id] = new player(socket.id, 'Guest', socket); // default nickname is guest

	{ // game controller
		socket.on('start-game-request', () => {
			activeRooms[socket.id] = rooms[socket.id];
			delete rooms[socket.id];

			let r = activeRooms[socket.id];

			// deal cards to player
			let cardsOut = dealCards(r.players.length);
			for (let i = 0; i < r.players.length; i++) r.players[i].cards = cardsOut[i];

			r.shufflePlayerOrder();

			r.phase = phases.distribute;

			// notify players
			for (let i = 0; i < r.players.length; i++) {
				let p = r.players[i];
				let options: { [id: string ] : any } = {};
				options[p.id] = true;

				// send signal to players that they can start their game, only allow them to see their respective cards
				p.socket.emit('start-game-answer', r.sanitize(options));
			}
		});
	}

	{ // room controller
		socket.on("create-room-request", (nickname) => {
			players[socket.id].nickname = nickname;
			rooms[socket.id] = new room(socket.id, players[socket.id]);
	
			socket.emit('create-room-answer', rooms[socket.id].sanitize());
		});
	
		socket.on('leave-room-request', (roomId) => {
			if (roomId == socket.id) { // host just left, kill room
				rooms[roomId].notifyPlayers('leave-room-answer');
				delete rooms[socket.id];
			} else { // regular user left
				rooms[roomId].removePlayer(socket.id);
	
				rooms[roomId].notifyPlayers('update-room', rooms[roomId].sanitize(), true, [socket.id]);
				socket.emit('leave-room-answer');
			}
		});
	
		socket.on('join-room-request', (roomId, nickname) => {
			players[socket.id].nickname = nickname;
	
			roomId = roomId.trim();
			if (roomId in rooms && rooms[roomId] != undefined && rooms[roomId].players.length < 4) {
				rooms[roomId].players.push(players[socket.id]);
				let r = rooms[roomId].sanitize();
	
				socket.emit('join-room-answer', r);
	
				rooms[roomId].notifyPlayers('update-room', r, true, [socket.id]);
			}
		});
	
		socket.on('room-kick-request', (roomId, id) => {
			// is owner and not trying to kick self
			if (socket.id == rooms[roomId].owner.id && id != socket.id) {
				rooms[roomId].removePlayer(id);
				players[id].socket.emit('leave-room-answer');
				rooms[roomId].notifyPlayers('update-room', rooms[roomId].sanitize());
			}
		});
	}

	socket.on('disconnect', () => {
		// destroy room if exists (this is host)
		if (socket.id in rooms) {
			// disconnect all players
			rooms[socket.id].notifyPlayers('leave-room-answer');
			delete rooms[socket.id];
		}
	});
});

const server = http.listen(8080, () => {
  console.log('listening on *:8080');
});
