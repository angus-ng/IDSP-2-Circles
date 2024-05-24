import { io } from "../app";

export const initializeSocket = () => {
    io.sockets.on('connection',function(socket){    
        socket.on('join',function(room){
            socket.join(room);
        });
        socket.on('room_message', function(data) {        
            io.to('room_one').emit('room_message',{world:'world'});
        });
    });
}
