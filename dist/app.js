"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
class App {
    constructor(controllers) {
        this._port = Number(process.env.PORT) || 5000;
        dotenv_1.default.config();
        this._app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    start() {
        this._app.listen(this._port, () => {
            console.log(`App running at: http://localhost:${this._port}/ 🚀`);
        });
    }
    initializeMiddlewares() {
        require("./middleware/express.middlewares")(this._app);
        require("./middleware/passport.middlewares")(this._app);
        // require("./middleware/authentication.middlewares")(this._app);
    }
    initializeErrorHandling() {
        this._app.use(error_middleware_1.default);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this._app.use("/", controller.router);
        });
    }
}
exports.default = App;
