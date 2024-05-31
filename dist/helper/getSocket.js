"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIo = void 0;
const socket_io_1 = require("socket.io");
class SocketIo {
    constructor() { }
    static getInstance(server) {
        if (!SocketIo.io) {
            SocketIo.io = new socket_io_1.Server(server);
        }
        return SocketIo.io;
    }
}
exports.SocketIo = SocketIo;
