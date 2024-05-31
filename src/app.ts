import express from "express";
import http from "http";
import { Server } from "socket.io";
import Controller from "./interfaces/controller.interface";
import dotenv from "dotenv";
import { SocketIo } from "./helper/getSocket";

let io: Server;
export { App, io };

class App {
  private _app: express.Application;
  private readonly _port: number = Number(process.env.PORT) || 5000;
  private _server: http.Server;
  private _io: Server;

  constructor(controllers: Controller[]) {
    dotenv.config();

    this._app = express();
    this._server = http.createServer(this._app);
    this._io = SocketIo.getInstance(this._server)
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    io = this._io
  }

  public start() {
    this._server.listen(this._port, () => {
      console.log(`App running at: http://localhost:${this._port}/ 🚀`);
    });
    io.on("connection", async (socket) => {
      socket.on('joinRoom', function(roomName) {
        socket.join(roomName)
      });
    });
  }

  private initializeMiddlewares() {
    require("./middleware/express.middlewares")(this._app);
  }


  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this._app.use("/", controller.router);
    });
  }
}

export default App;
