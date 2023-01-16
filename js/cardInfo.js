export function getCardId(suit, number) {
    return suit * 14 + number; // 14 because numbers is one based so +1
}

export function getCardRank(id) {
    return id % 14;
}

export function getCardSuit(id) {
    return (id - id % 14) / 14;
}

export const suits = {
    club: 0,
    heart: 1,
    spade: 2,
    diamond: 3
}

// stfu
export const numbers = {
    ace: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 11,
    queen: 12,
    king: 13
}
