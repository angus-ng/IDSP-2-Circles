"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
class App {
    constructor(controllers) {
        this._port = Number(process.env.PORT) || 5000;
        dotenv_1.default.config();
        this._app = (0, express_1.default)();
        this._server = http_1.default.createServer(this._app);
        this._wss = new ws_1.WebSocketServer({ server: this._server });
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeWebSocket();
    }
    start() {
        this._server.listen(this._port, () => {
            console.log(`App running at: http://localhost:${this._port}/ 🚀`);
        });
    }
    initializeMiddlewares() {
        require("./middleware/express.middlewares")(this._app);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this._app.use("/", controller.router);
        });
    }
    initializeWebSocket() {
        this._wss.on("connection", (ws) => {
            console.log("New client connected");
            ws.on("message", (message) => {
                console.log(`Message received: ${message}`);
                ws.send(`Message sent: ${message}`);
            });
            ws.on("close", () => {
                console.log("Client has disconnected");
            });
        });
    }
}
exports.default = App;
