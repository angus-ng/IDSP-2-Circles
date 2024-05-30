import { io } from "../app";

export const initializeSocket = () => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('likePost', (postId) => {
          // Broadcast the like event to all connected clients
          io.emit('postLiked', postId);
        });
      
      });   
}
