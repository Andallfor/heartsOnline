import { emit, socket, addCallback, getValueById } from '/html/common.js'

document.addEventListener('DOMContentLoaded', () => {
    const roomController = document.getElementById('room-controller');
    initializeRegularView();

    let currentRoomId = 0;

    socket.on('create-room-answer', (room) => {
        roomController.innerHTML = roomViewLeader;
        document.getElementById('room-id').innerText = socket.id;
        document.getElementById('nickname').setAttribute('disabled', null);

        currentRoomId = socket.id;

        addCallback('room-leave', 'click', () => {emit('leave-room-request', currentRoomId);});

        drawRoom(room, true);
    });

    socket.on('join-room-answer', (room) => {
        roomController.innerHTML = roomViewFollower;
        document.getElementById('room-id').innerText = room["owner"]["id"];
        document.getElementById('nickname').setAttribute('disabled', null);

        currentRoomId = room["owner"]["id"];

        addCallback('room-leave', 'click', () => {emit('leave-room-request', currentRoomId);});

        drawRoom(room, false);
    });

    socket.on('update-room', (data) => {drawRoom(data, (data['owner']['id'] == socket.id));}); // redraw room every time something changes. Why? because fuck you

    socket.on('leave-room-answer', () => {
        initializeRegularView();
        document.getElementById('nickname').removeAttribute('disabled');
    });

    function drawRoom(room, isLeader=false) {
        document.getElementById('room-player-list').innerHTML = '';
        document.getElementById('room-num-players').innerText = room["numPlayers"];

        let index = 0;
        for (let pId in room["players"]) {
            let p = room["players"][pId];
            document.getElementById('room-player-list').innerHTML += (isLeader) ? playerViewLeader : playerViewFollower;
            let reg = document.getElementById('room-init-player');
            reg.id = pId;

            if (index == room["numPlayers"] - 1) reg.firstElementChild.innerText = listConnectorEnd;
            reg.lastElementChild.innerText = p["nickname"];

            if (pId == socket.id) {
                reg.lastElementChild.innerText += ' (You)';
                if (isLeader) reg.children[1].setAttribute('disabled', null)
            }

            if (pId == room["owner"]["id"]) {
                reg.lastElementChild.innerText += ' (👑)';
            }

            index++;
        }

        if (isLeader) {
            if (room["numPlayers"] > 1) document.getElementById('room-start-game').removeAttribute('disabled');
            else document.getElementById('room-start-game').setAttribute('disabled', null);
        }
    }

    function checkForValidInput(srcId, buttonId, blacklist) {
        let text = document.getElementById(srcId).value.trim();
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
    <button disabled type="button" id="create-room">Create New Room</button>`;

const roomViewLeader = `
    <span>Room ID: <span id="room-id">82975</span> <button id="room-leave" input="button">End Room</button></span>
    <p></p>
    <span>Current Players (<span id="room-num-players">0</span>/4):</span>
    <div id="room-player-list">
    </div>
    <p class="condensed">============</p>
    <button id = "room-start-game" input="button">Start Game</button>`;

const roomViewFollower = `
    <span>Room ID: <span id="room-id">82975</span> <button id="room-leave" input="button">Leave Room</button></span>
    <p></p>
    <span>Current Players (<span id="room-num-players">0</span>/4):</span>
    <div id="room-player-list">
    </div>`;

const playerViewLeader = `
    <p id="room-init-player" class="condensed">
        <span>├</span>
        <button input="button" style="margin-right: 5px; margin-left: 5px">Kick</button>
        <span>Guest</span>
    </p>`;

const playerViewFollower = `
    <p id="room-init-player" class="condensed">
        <span>├</span>
        <span>Guest</span>
    </p>
`;

const listConnectorEnd = '└';
const listConnectorMiddle = '├';