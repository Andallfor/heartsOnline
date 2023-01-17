import { sanitizedRoom } from '../js/room.js';
import { emit, socket, addCallback, getValueById } from './common.js'

document.addEventListener('DOMContentLoaded', () => {
    socket.on('start-game-answer', (data: sanitizedRoom) => {
        console.log('passed');
        document.getElementById('pregame').innerHTML = '';
        console.log(data);
    });
});