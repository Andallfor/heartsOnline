"use strict"

export const socket = io();
export function emit(sign, data=null) {
    socket.emit(sign, data);
}