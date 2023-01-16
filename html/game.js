import { emit, socket, addCallback, getValueById } from '/html/common.js'

document.addEventListener('DOMContentLoaded', () => {
    socket.on('start-game-answer', (data) => {
        console.log('passed');
        document.getElementById('pregame').innerHTML = '';
        console.log(data);
    });
});