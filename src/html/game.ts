import { cardID, getCardSuit, getCardRank, suits, numbers, numberToFile } from '../js/cardInfo.js';
import { sanitizedPlayer } from '../js/playerInfo.js';
import { sanitizedRoom } from '../js/room.js';
import { emit, socket, addCallback, getValueById } from './common.js'

function createPlayerView(pos: pPos, parent: HTMLElement) {
    let p = document.createElement('div');
    p.id = pos;
    p.className = 'player_position_' + pos;

    let content = document.createElement('div');
    content.id = pos + '_content';
    content.className = 'player_content_' + pos;
    if (pos == 'top' || pos == 'bottom') {
        p.className += ' player_position_horizontal';
        content.className += ' player_content_horizontal';
    } else {
        p.className += ' player_position_vertical';
        content.className += ' player_content_vertical';
    }

    p.appendChild(content);

    parent.appendChild(p);
}

function getCardPath(id: cardID, pos: pPos) {
    let prefix = 'assets/Cards (large)/card_';
    if (id == 0) {
        if (pos == pPos.top) return prefix + 'back_red.png';
        if (pos == pPos.left) return prefix + 'back_green.png';
        if (pos == pPos.right) return prefix + 'back_blue.png';
        return prefix + 'back_purple.png';
    }

    let _suit = getCardSuit(id);
    let suit = '';
    if (_suit == suits.club) suit = 'clubs_';
    else if (_suit == suits.heart) suit = 'hearts_';
    else if (_suit == suits.diamond) suit = 'diamonds_';
    else suit = 'spades_';

    let c = numberToFile[getCardRank(id)] + '.png';

    return prefix + suit + c;
}

function drawCards(pos: pPos, data: sanitizedPlayer) {
    let suffix = '';
    if (pos == pPos.top || pos == pPos.bottom) suffix = 'vw';
    else suffix = 'vh';

    if (data.cards.length == 0) return;

    let width = (50 / data.cards.length) * (64 / 42);
    let dist = (50 / data.cards.length) * (42 / 64) * (32 / 64);

    let parent = document.getElementById(pos + '_content');

    for (let i = 0; i < data.cards.length; i++) {
        let img = document.createElement('img');
        img.src = getCardPath(data.cards[i], pos);

        if (suffix == 'vw') img.setAttribute('style', `width: ${width}vw; height: auto; right: ${dist * i}vw; position: absolute;`);
        else img.setAttribute('style', `width: auto; height: ${width}vh; top: ${dist * i}vh; position: absolute;`);

        parent.appendChild(img);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    socket.on('start-game-answer', (data: sanitizedRoom) => {
        document.getElementById('pregame').innerHTML = '';

        // create player positions
        // create bottom, which will always exist
        const gameDiv = document.getElementById('game');
        createPlayerView(pPos.bottom, gameDiv);
        playerLocations[pPos.bottom] = data.players[socket.id];

        let flattenedIds = [];
        for (let id of Object.keys(data.players).values()) {
            if (id != socket.id) flattenedIds.push(id);
        }

        let posses: pPos[] = positionsPerPlayerCount[data.numPlayers];
        console.log(positionsPerPlayerCount[data.numPlayers]);
        console.log(posses);
        let i = 0;
        for (let pos of posses) {
            console.log(pos);
            playerLocations[pos as pPos] = data.players[flattenedIds[i]];
            createPlayerView(pos as pPos, gameDiv);
            drawCards(pos as pPos, playerLocations[pos as pPos]);
            i++;
        }
    });
});

enum pPos {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right'
};

const playerLocations: Record<pPos, sanitizedPlayer> = {
    'top': null,
    'bottom': null,
    'left': null,
    'right': null
};

const positionsPerPlayerCount: Record<number, pPos[]> = {
    2: [pPos.top],
    3: [pPos.top, pPos.right],
    4: [pPos.top, pPos.right, pPos.left]
};

const posColor: Record<pPos, string> = {
    'top': "card_back_red.png",
    'bottom': "card_back_purple.png",
    'left': "card_back_green.png",
    'right': "card_back_blue.png"
};
