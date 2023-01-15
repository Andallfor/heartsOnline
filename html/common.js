"use strict"

export const socket = io();

export function emit(sign, ...args) {
    console.log(sign);
    socket.emit(sign, ...args);
}

export function addCallback(id, event, func, trigger=false) {
    document.getElementById(id).addEventListener(event, func);
    if (trigger) func();
}

export function getValueById(id) {return document.getElementById(id).value;}