"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const app_1 = require("../app");
const initializeSocket = () => {
    app_1.io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('likePost', (postId) => {
            // Broadcast the like event to all connected clients
            app_1.io.emit('postLiked', postId);
        });
    });
};
exports.initializeSocket = initializeSocket;
