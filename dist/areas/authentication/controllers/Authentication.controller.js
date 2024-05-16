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
const passport_1 = __importDefault(require("passport"));
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
            let user = yield this._service.getUserById(kindeUser.id);
            if (!user) {
                //@ts-ignore
                user = yield this._service.createUser({
                    id: kindeUser.id,
                    username: kindeUser.id,
                    firstName: kindeUser.family_name,
                    lastName: kindeUser.given_name,
                    profilePicture: kindeUser.picture || ""
                });
            }
            //@ts-ignore
            req.user = user;
            return res.redirect("/");
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const logoutUrl = yield kinde_1.kindeClient.logout((0, kinde_1.sessionManager)(req, res));
            return res.redirect(logoutUrl.toString());
        });
        this.getSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (req.user) {
                    res.json({ success: true, username: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username });
                }
                else {
                    const user = yield kinde_1.kindeClient.getUser((0, kinde_1.sessionManager)(req, res));
                    res.json({ success: true, username: user.id });
                }
                // make this return the user family name igven name picture email id whatvere u want or make user make a new name.
            }
            catch (error) {
                res.json({ success: false, errorMessage: "Not logged in" });
            }
        });
        this.local = (req, res, next) => {
            passport_1.default.authenticate('local', function (err, user, info) {
                if (err || !user) {
                    return res.status(200).json({ success: true, data: null });
                }
                req.logIn(user, function (err) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            return res.status(200).json({ success: true, data: null });
                        }
                        res.status(200).json({ success: true, data: req.user.username });
                    });
                });
            })(req, res, next);
        };
        this.registration = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userProfile = req.body;
            try {
                const user = yield this._service.findUserByEmail(userProfile.email);
                if (!user) {
                    yield this._service.createUser(userProfile);
                    res.redirect("/");
                }
                else {
                    const error = new Error(userProfile.email);
                    const errorMessage = error.message;
                    res.render("authentication/views/register", { errorMessage });
                    throw error;
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.facebook = passport_1.default.authenticate("facebook");
        this.facebookCb = passport_1.default.authenticate("facebook", {
            successRedirect: "/",
            failureRedirect: '/'
        });
        this.google = passport_1.default.authenticate("google");
        this.googleCb = passport_1.default.authenticate("google", {
            successRedirect: "/",
            failureRedirect: '/'
        });
        this.initializeRoutes();
        this._service = service;
    }
    initializeRoutes() {
        this.router.get(`${this.path}/getSession`, this.getSession);
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/local`, this.local);
        this.router.get(`${this.path}/login`, this.login);
        this.router.get(`${this.path}/register`, this.register);
        this.router.get(`${this.path}/facebook`, this.facebook);
        this.router.get(`${this.path}/facebook/callback`, this.facebookCb);
        this.router.get(`${this.path}/google`, this.google);
        this.router.get(`${this.path}/google/callback`, this.googleCb);
        this.router.get(`${this.path}/callback`, this.callback);
        this.router.get(`${this.path}/logout`, this.logout);
    }
}
exports.default = AuthenticationController;
