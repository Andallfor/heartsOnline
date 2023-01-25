import { sanitizedRoom } from '../js/room.js';
import { emit, socket, addCallback, getValueById } from './common.js'

document.addEventListener('DOMContentLoaded', () => {
    socket.on('start-game-answer', (data: sanitizedRoom) => {
        document.getElementById('pregame').innerHTML = '';
    });
});

const playerView = `
<div id="test" style="right: 50vw; left: 50vw; bottom: 95vh; top: 5vh; position: absolute"></div>

<div id="player_3" style="right: 5vw; left: 95vw; bottom: 50vh; top: 50vh; position: absolute">
    right
</div>

<div id="player_0" style="right: 50vw; left: 50vw; bottom: 5vh; top: 95vh; position: absolute">
    bottom
</div>

<div id="player_1" style="right: 95vw; left: 5vw; bottom: 50vh; top: 50vh; position: absolute">
    left
</div>`

const playerContent = `<div id="test_content" style="width: 50vw; height: 15vh; position: relative; right: 25vw; top: -10vh"></div>`

const card = `<img src="assets/Cards (large)/card_back_red.png" style="width:10vw; height:auto">`