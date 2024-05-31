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
const kinde_1 = require("../config/kinde");
class AuthenticationController {
    constructor(service) {
        this.path = "/auth";
        this.router = express_1.default.Router();
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loginUrl = yield kinde_1.kindeClient.login((0, kinde_1.sessionManager)(req, res));
            return res.redirect(loginUrl.toString());
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const registerUrl = yield kinde_1.kindeClient.register((0, kinde_1.sessionManager)(req, res));
            return res.redirect(registerUrl.toString());
        });
        this.callback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
            yield kinde_1.kindeClient.handleRedirectToApp((0, kinde_1.sessionManager)(req, res), url);
            const kindeUser = yield kinde_1.kindeClient.getUser((0, kinde_1.sessionManager)(req, res));
            console.log(kindeUser);
            let user = yield this._service.getUserById(kindeUser.id);
            if (!user) {
                //@ts-ignore
                let username = kindeUser.username;
                if (!username) {
                    username = kindeUser.given_name + kindeUser.family_name + Math.floor(Math.random() * 100000);
                }
                //@ts-ignore
                user = yield this._service.createUser({
                    id: kindeUser.id,
                    username: username,
                    firstName: kindeUser.family_name,
                    lastName: kindeUser.given_name,
                    profilePicture: kindeUser.picture || "/placeholder_image.svg",
                    displayName: kindeUser.given_name + kindeUser.family_name
                });
            }
            //@ts-ignore
            req.user = user;
            return res.redirect("/");
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const logoutUrl = yield kinde_1.kindeClient.logout((0, kinde_1.sessionManager)(req, res));
            return res.redirect("/");
        });
        this.getSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (req.user) {
                    res.json({ success: true, username: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username });
                }
                else {
                    const kindeUser = yield kinde_1.kindeClient.getUser((0, kinde_1.sessionManager)(req, res));
                    const user = yield this._service.getUserById(kindeUser.id);
                    res.json({ success: true, username: user === null || user === void 0 ? void 0 : user.username });
                }
                // make this return the user family name igven name picture email id whatvere u want or make user make a new name.
            }
            catch (error) {
                res.json({ success: false, errorMessage: "Not logged in" });
            }
        });
        this.initializeRoutes();
        this._service = service;
    }
    initializeRoutes() {
        this.router.get(`${this.path}/getSession`, this.getSession);
        this.router.get(`${this.path}/login`, this.login);
        this.router.get(`${this.path}/register`, this.register);
        this.router.get(`${this.path}/callback`, this.callback);
        this.router.get(`${this.path}/logout`, this.logout);
    }
}
exports.default = AuthenticationController;
