import { sanitizedRoom } from '../js/room.js';
import { emit, socket, addCallback, getValueById } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
    const roomController = document.getElementById('room-controller');
    initializeRegularView();

    let currentRoomId: string;

    socket.on('create-room-answer', (room: sanitizedRoom) => {
        roomController.innerHTML = roomViewLeader;
        document.getElementById('room-id').innerText = socket.id;
        document.getElementById('nickname').setAttribute('disabled', '');

        currentRoomId = socket.id;

        addCallback('room-leave', 'click', () => {emit('leave-room-request', currentRoomId);});
        addCallback('room-start-game', 'click', () => {emit('start-game-request');});

        drawRoom(room, true);
    });

    socket.on('join-room-answer', (room: sanitizedRoom) => {
        roomController.innerHTML = roomViewFollower;
        document.getElementById('room-id').innerText = room["owner"]["id"];
        document.getElementById('nickname').setAttribute('disabled', null);

        currentRoomId = room["owner"]["id"];

        addCallback('room-leave', 'click', () => {emit('leave-room-request', currentRoomId);});

        drawRoom(room, false);
    });

    socket.on('update-room', (data: sanitizedRoom) => {
        // redraw room every time something changes. Why? because fuck you
        let isLeader = data['owner']['id'] == socket.id;
        drawRoom(data, isLeader);

        // done out here instead of inside drawRoom() because it doesn't seem to work in in drawRoom() idk y
        if (isLeader && data["numPlayers"] > 1) {
            for (let pId in data["players"]) {
                if (pId == socket.id) continue;
                addCallback(pId + '-kick', 'click', () => {emit('room-kick-request', currentRoomId, pId);});
            }
        }
    });

    socket.on('leave-room-answer', () => {
        initializeRegularView();
        document.getElementById('nickname').removeAttribute('disabled');
    });

    function drawRoom(room: sanitizedRoom, isLeader=false) {
        document.getElementById('room-player-list').innerHTML = '';
        document.getElementById('room-num-players').innerText = room["numPlayers"].toString();

        let index = 0;
        for (let pId in room["players"]) {
            let p = room["players"][pId];
            document.getElementById('room-player-list').innerHTML += (isLeader) ? playerViewLeader : playerViewFollower;
            let reg = document.getElementById('room-init-player');
            reg.id = pId;

            let lastEle = reg.lastElementChild as HTMLElement;
            let firstEle = reg.firstElementChild as HTMLElement;

            if (index == room["numPlayers"] - 1) firstEle.innerText = listConnectorEnd;
            lastEle.innerText = p["nickname"];

            if (pId == socket.id) {
                lastEle.innerText += ' (You)';
                if (isLeader) reg.children[1].setAttribute('disabled', null)
            }

            if (pId == room["owner"]["id"]) lastEle.innerText += ' (👑)';

            if (isLeader && pId != socket.id) reg.children[1].id = pId + '-kick';

            index++;
        }

        if (isLeader) {
            if (room["numPlayers"] > 1) document.getElementById('room-start-game').removeAttribute('disabled');
            else document.getElementById('room-start-game').setAttribute('disabled', null);
        }
    }

    function checkForValidInput(srcId: string, buttonId: string, blacklist: Array<string>) {
        let text = (document.getElementById(srcId) as HTMLInputElement).value.trim();
        if (blacklist.includes(text)) document.getElementById(buttonId).setAttribute('disabled', null);
        else document.getElementById(buttonId).removeAttribute('disabled');
    }

    function initializeRegularView() {
        roomController.innerHTML = regularView;

        addCallback('create-room', 'click', () => {emit('create-room-request', getValueById('nickname'));});
        addCallback('join-room', 'click', () => {emit('join-room-request', getValueById('room-id-select'), getValueById('nickname'));});
        addCallback('room-id-select', 'input', () => {checkForValidInput('room-id-select', 'join-room', ['']);});
        addCallback('nickname', 'input', () => {checkForValidInput('nickname', 'create-room', ['', 'Guest']);}, true);
    }
});

const regularView = `
    <label for="room-id-select">Room ID: </label>
    <input type="text" id="room-id-select" value="">
    <button disabled type="button" id="join-room">Join Room</button>
    <div></div>
    <label for="create-room">Or: </label>
    <button disabled type="button" id="create-room">Create New Room</button>
`;

const roomViewLeader = `
    <span>Room ID: <span id="room-id">82975</span> <button id="room-leave" input="button">End Room</button></span>
    <p></p>
    <span>Current Players (<span id="room-num-players">0</span>/4):</span>
    <div id="room-player-list">
    </div>
    <p class="condensed">============</p>
    <button id = "room-start-game" input="button">Start Game</button>
`;

const roomViewFollower = `
    <span>Room ID: <span id="room-id">82975</span> <button id="room-leave" input="button">Leave Room</button></span>
    <p></p>
    <span>Current Players (<span id="room-num-players">0</span>/4):</span>
    <div id="room-player-list">
    </div>
`;

const playerViewLeader = `
    <p id="room-init-player" class="condensed">
        <span>├</span>
        <button input="button" style="margin-right: 5px; margin-left: 5px">Kick</button>
        <span>Guest</span>
    </p>
`;

const playerViewFollower = `
    <p id="room-init-player" class="condensed">
        <span>├</span>
        <span>Guest</span>
    </p>
`;

const listConnectorEnd = '└';
const listConnectorMiddle = '├';
