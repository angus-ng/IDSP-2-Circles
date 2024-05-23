import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import Controller from "./interfaces/controller.interface";
import dotenv from "dotenv";

class App {
  private _app: express.Application;
  private readonly _port: number = Number(process.env.PORT) || 5000;
  private _server: http.Server;
  private _wss: WebSocketServer;

  constructor(controllers: Controller[]) {
    dotenv.config();

    this._app = express();
    this._server = http.createServer(this._app);
    this._wss = new WebSocketServer({ server: this._server });
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeWebSocket();
  }

  public start() {
    this._server.listen(this._port, () => {
      console.log(`App running at: http://localhost:${this._port}/ 🚀`);
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

  private initializeWebSocket() {
    this._wss.on("connection", (ws: WebSocket) => {
      console.log("New client connected");

      ws.on("message", (message: string) => {
        console.log(`Message received: ${message}`);
        ws.send(`Message sent: ${message}`);
      });

      ws.on("close", () => {
        console.log("Client has disconnected");
      });
    });
  }
}

export default App;
