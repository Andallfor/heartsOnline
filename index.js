"use strict";

// i hate js
import { room } from './js/room.js';
import { player } from './js/playerInfo.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = new socketIO.Server(server);

app.use('/', express.static(__dirname + '/'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const rooms = {} // key is room id, value is room class
const players = {} // playerId, player class

io.on('connection', (socket) => {
	// create new player instance
	players[socket.id] = new player(socket.id, 'Guest'); // default nickname is guest

  	socket.on("create-room", () => {
		rooms[socket.id] = new room(socket.id);

    	socket.emit('init-current-room', socket.id);
	});

	socket.on('disconnect', () => {

	});
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});
