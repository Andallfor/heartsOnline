"use strict"

export const socket = io();

export function emit(sign, data=null) {
    console.log(sign);
    socket.emit(sign, data);
}

export function addCallback(id, event, func, trigger=false) {
    document.getElementById(id).addEventListener(event, func);
    if (trigger) func();
}