import http from "http";
import { Server, Socket } from "socket.io";

export class SocketIo {
    private static io: Server;

    private constructor() { }

    public static getInstance(server: http.Server): Server {
        if (!SocketIo.io) {
            SocketIo.io = new Server(server);
        }

        return SocketIo.io;
    }
}