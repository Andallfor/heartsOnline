import { emit, socket } from '/html/common.js'

let playerList = [];

document.addEventListener('DOMContentLoaded', () => {
    const roomController = document.getElementById('room-controller');
    roomController.innerHTML = regularView;
    
    document.getElementById('create-room').addEventListener('click', () => {emit('create-room');});

    socket.on('init-room', (id, room) => {
        roomController.innerHTML = roomLeaderView;
        document.getElementById('room-id').innerText = id;

        drawRoom(room);
    });

    socket.on('update-room', (data) => {
        // redraw room every time something changes. Why? because fuck you
        drawRoom(data);
    });

    function drawRoom(room) {
        document.getElementById('room-player-list').innerHTML = '';
        document.getElementById('room-num-players').innerText = room.players.length;

        for (let i = 0; i < room.players.length; i++) {
            let p = room.players[i];
            // i dont want to hear it. it works ok
            document.getElementById('room-player-list').innerHTML += playerView;
            let reg = document.getElementById('room-init-player');
            reg.id = p.id;

            if (i == room.players.length - 1) reg.firstElementChild.innerText = listConnectorEnd;
            reg.lastElementChild.innerText = p.nickname;

            if (p.id == socket.id) {
                reg.lastElementChild.innerText += ' (You)';
                reg.children[1].setAttribute('disabled', null)
            }
        }
    }
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
    <p id="room-init-player" class="condensed">
        <span>├</span>
        <button input="button" style="margin-right: 5px; margin-left: 5px">Kick</button>
        <span>Guest</span>
    </p>`

const listConnectorEnd = '└'
const listConnectorMiddle = '├'