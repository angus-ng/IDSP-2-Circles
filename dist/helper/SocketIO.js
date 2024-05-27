"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const app_1 = require("../app");
const initializeSocket = () => {
    app_1.io.sockets.on('connection', function (socket) {
        socket.on('join', function (room) {
            socket.join(room);
        });
        socket.on('room_message', function (data) {
            app_1.io.to('room_one').emit('room_message', { world: 'world' });
        });
    });
};
exports.initializeSocket = initializeSocket;
