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
const EmailAlreadyExists_1 = __importDefault(require("../../../exceptions/EmailAlreadyExists"));
const passport_1 = __importDefault(require("passport"));
const node_path_1 = __importDefault(require("node:path"));
class AuthenticationController {
    constructor(service) {
        this.path = "/auth";
        this.router = express_1.default.Router();
        this.getSession = (req, res) => {
            if (req.user) {
                res.json({ success: true, username: req.user.username });
                return;
            }
            res.json({ success: false, errorMessage: "Not logged in" });
        };
        this.showLoginPage = (_, res) => {
            // if(res.locals.currentUser) {
            //   console.log("hello")
            //   res.redirect("/") // post
            //   return
            // }
            res.render(node_path_1.default.join(__dirname, "../views/login"));
        };
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
        this.showRegistrationPage = (_, res) => {
            if (res.locals.currentUser) {
                res.redirect("/"); // post
                return;
            }
            res.render(node_path_1.default.join(__dirname, "../views/register"));
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
                    const error = new EmailAlreadyExists_1.default(userProfile.email);
                    const errorMessage = error.message;
                    res.render("authentication/views/register", { errorMessage });
                    throw error;
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            req.logout((err) => {
                if (err)
                    console.log(err);
            });
            res.redirect("/");
        });
        this.facebook = passport_1.default.authenticate("facebook");
        this.facebookCb = (req, res, next) => {
            passport_1.default.authenticate('facebook', function (err, user, info) {
                if (err || !user) {
                    return res.status(200).json({ success: true, data: null });
                }
                console.log("this", user);
                res.status(200).json({ success: true, data: user.username });
            })(req, res, next);
        };
        this.google = passport_1.default.authenticate("google");
        this.googleCb = passport_1.default.authenticate("google", {
            successRedirect: "/",
            failureRedirect: '/auth/login'
        });
        this.initializeRoutes();
        this._service = service;
    }
    initializeRoutes() {
        this.router.get(`${this.path}/getSession`, this.getSession);
        this.router.get(`${this.path}/register`, this.showRegistrationPage);
        this.router.post(`${this.path}/register`, this.registration);
        this.router.get(`${this.path}/login`, this.showLoginPage);
        this.router.post(`${this.path}/local`, this.local);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.get(`${this.path}/facebook`, this.facebook);
        this.router.get(`${this.path}/facebook/callback`, this.facebookCb);
        this.router.get(`${this.path}/google`, this.google);
        this.router.get(`${this.path}/google/callback`, this.googleCb);
    }
}
exports.default = AuthenticationController;
