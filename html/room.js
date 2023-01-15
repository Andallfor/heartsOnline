import { emit, socket } from '/html/common.js'

document.addEventListener('DOMContentLoaded', () => {
    const roomController = document.getElementById('room-controller');
    roomController.innerHTML = regularView;
    
    document.getElementById('create-room').addEventListener('click', () => {emit('create-room');});

    socket.on('init-current-room', (id) => {
        roomController.innerHTML = roomLeaderView;
    });
});

const regularView = `
    <label for="room-id-select">Room id: </label>
    <input type="text" id="room-id-select" value="">
    <button disabled="true" type="button" id="join-room" onclick="
        emit(
            'joinRoom',
            [document.getElementById('room').innerText, document.getElementById('nickname').innerText]
        )">Join Room</button>
    <div></div>
    <label for="create-room">Or: </label>
    <button type="button" id="create-room">Create New Room</button>`;

const roomLeaderView = `
    <span>Room ID: <span id="room-id">82975</span> <button input="button">End Room</button></span>
    <p></p>
    <span>Current Players (<span id="room-num-players">0</span>/4):</span>
    <div id="room-player-list">
    </div>
    <p class="condensed">============</p>
    <button input="button">Start Game</button>
`

const playerView = `
    <p id="89732" class="condensed">
        <span>├</span>
        <button input="button" style="margin-right: 5px; margin-left: 5px">Kick</button>
        <span>Guest</span>
    </p>`

const listConnectorEnd = '└'
const listConnectorMiddle = '├'