"use strict"

import { Socket } from "socket.io-client";

// shhhhhhhhhhhhhhhhhhhhhhhh
// @ts-ignore
export const socket: Socket = io();

export function emit(sign: string, ...args: any) {
    socket.emit(sign, ...args);
}

export function addCallback(id: string, event: string, func: any, trigger=false) {
    document.getElementById(id).addEventListener(event, func);
    if (trigger) func();
}

export function getValueById(id: string) {return (document.getElementById(id) as HTMLInputElement).value;}