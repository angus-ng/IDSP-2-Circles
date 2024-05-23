"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
class App {
    constructor(controllers) {
        this._port = Number(process.env.PORT) || 5000;
        dotenv_1.default.config();
        this._app = (0, express_1.default)();
        this._server = http_1.default.createServer(this._app);
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    start() {
        this._server.listen(this._port, () => {
            console.log(`App running at: http://localhost:${this._port}/ 🚀`);
        });
    }
    initializeMiddlewares() {
        require("./middleware/express.middlewares")(this._app);
        require("./middleware/passport.middlewares")(this._app);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this._app.use("/", controller.router);
        });
    }
}
exports.default = App;
