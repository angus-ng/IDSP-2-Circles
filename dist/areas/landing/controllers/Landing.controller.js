"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
class LandingController {
    constructor() {
        this.path = "/";
        this.router = express_1.default.Router();
        this.showLandingPage = (_, res) => {
            res.render(path_1.default.join(__dirname, "../../../../public/index.html"));
            return;
        };
        this.getGoogleMapKey = (_, res) => {
            return res.status(200).json({ success: true, data: process.env.GOOGLE_MAP_API_KEY });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/`, this.showLandingPage);
        this.router.get(`${this.path}googleMapKey`, this.getGoogleMapKey);
    }
}
exports.default = LandingController;
