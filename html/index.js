"use strict"

import { socket } from '/html/common.js';

document.addEventListener('DOMContentLoaded', () => {
    socket.on('update html', (id, newId, data) => {
        let ele = document.createElement('div');
        ele.id = newId;
        ele.innerHTML = data;
        document.getElementById(id).appendChild(ele);
    });

    socket.on('send command', (command) => {
        eval(command);
    });
});