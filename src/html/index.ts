"use strict"

import { socket } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
    socket.on('update html', (id: string, newId: string, data: any) => {
        let ele = document.createElement('div');
        ele.id = newId;
        ele.innerHTML = data;
        document.getElementById(id).appendChild(ele);
    });

    socket.on('send command', (command: string) => {eval(command);});
});