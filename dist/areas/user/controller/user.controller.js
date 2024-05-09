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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../../middleware/authentication.middleware");
const services_1 = require("../services");
class UserController {
    constructor(userService) {
        this.path = "/user";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
        this._service = userService;
    }
    initializeRoutes() {
        this.router.post(`${this.path}/follow`, authentication_middleware_1.ensureAuthenticated, this.follow);
        this.router.post(`${this.path}/unfollow`, authentication_middleware_1.ensureAuthenticated, this.unfollow);
        this.router.get(`${this.path}/getFollowers/:followingName`, authentication_middleware_1.ensureAuthenticated, this.getFollowers);
        this.router.get(`${this.path}/getFollowing/:followerName`, authentication_middleware_1.ensureAuthenticated, this.getFollowing);
    }
    follow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    unfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const followerName = req.params.followerName;
            console.log(req.params.followerName, "getFollowers");
            yield this._service.getFollowers(followerName);
        });
    }
    getFollowing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const followingName = req.params.followingName;
            console.log(req.query, req.params, "getFollowing");
            const userservice = new services_1.UserService();
            //console.log(this._service,"hello")
            yield userservice;
            getFollowing(followingName);
            //await this._service.getFollowing("A_A")
        });
    }
}
exports.default = UserController;
