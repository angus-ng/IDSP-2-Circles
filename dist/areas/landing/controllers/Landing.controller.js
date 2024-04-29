"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../../../middleware/authentication.middleware");
const path_1 = __importDefault(require("path"));
class LandingController {
    constructor() {
        this.path = "/";
        this.router = express_1.default.Router();
        this.showLandingPage = (_, res) => {
            res.render(path_1.default.join(__dirname, "../views/index"));
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/`, authentication_middleware_1.forwardAuthenticated, this.showLandingPage);
    }
}
exports.default = LandingController;
