"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../../../middleware/authentication.middleware");
class UserController {
    constructor(userService) {
        this.path = "/user";
        this.router = express_1.default.Router();
        this.follow = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
        this.unfollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
        this.getFollowers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const followingName = req.params.followingName;
            console.log(req.params.followingName, "getFollowers");
            const d = yield this._service.getFollowers(followingName);
            console.log(d);
            res.status(200).json({ success: true, data: null });
        });
        this.getFollowing = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const followerName = req.params.followerName;
            console.log(followerName, "THIS");
            console.log(req.query, req.params, "getFollowing");
            //console.log(this._service,"hello")
            // console.log(this._service)
            const d = yield this._service.getFollowing(followerName);
            console.log(d);
            //await this._service.getFollowing("A_A")
            res.status(200).json({ success: true, data: null });
        });
        this.initializeRoutes();
        this._service = userService;
    }
    initializeRoutes() {
        this.router.post(`${this.path}/follow`, authentication_middleware_1.ensureAuthenticated, this.follow);
        this.router.post(`${this.path}/unfollow`, authentication_middleware_1.ensureAuthenticated, this.unfollow);
        this.router.get(`${this.path}/getFollowers/:followingName`, authentication_middleware_1.ensureAuthenticated, this.getFollowers);
        this.router.get(`${this.path}/getFollowing/:followerName`, authentication_middleware_1.ensureAuthenticated, this.getFollowing);
    }
}
exports.default = UserController;
