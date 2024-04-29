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
class AuthenticationController {
    constructor(service) {
        this.path = "/auth";
        this.router = express_1.default.Router();
        this.showLoginPage = (_, res) => {
            if (res.locals.currentUser) {
                res.redirect("/posts");
                return;
            }
            res.render("authentication/views/login");
        };
        this.showRegistrationPage = (_, res) => {
            if (res.locals.currentUser) {
                res.redirect("/posts");
                return;
            }
            res.render("authentication/views/register");
        };
        this.login = passport_1.default.authenticate("local", {
            successRedirect: "/posts",
            failureRedirect: "/auth/login",
            failureMessage: true,
        });
        this.registration = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userProfile = req.body;
            try {
                const user = yield this._service.findUserByEmail(userProfile.email);
                if (!user) {
                    yield this._service.createUser(userProfile);
                    res.redirect("/auth/login");
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
            res.redirect("/auth/login");
        });
        this.initializeRoutes();
        this._service = service;
    }
    initializeRoutes() {
        this.router.get(`${this.path}/register`, this.showRegistrationPage);
        this.router.post(`${this.path}/register`, this.registration);
        this.router.get(`${this.path}/login`, this.showLoginPage);
        this.router.post(`${this.path}/login`, this.login, (req, res) => {
            res.redirect("/posts");
        });
        this.router.get(`${this.path}/logout`, this.logout);
    }
}
exports.default = AuthenticationController;
