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
exports.setCurrentUser = exports.forwardAuthenticated = exports.ensureAuthenticated = void 0;
const kinde_1 = require("../areas/authentication/config/kinde");
const ensureAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield kinde_1.kindeClient.isAuthenticated((0, kinde_1.sessionManager)(req, res))) {
        return next();
    }
    res.redirect("/");
    return;
});
exports.ensureAuthenticated = ensureAuthenticated;
const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    }
    return next();
};
exports.forwardAuthenticated = forwardAuthenticated;
const setCurrentUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user;
    }
    next();
};
exports.setCurrentUser = setCurrentUser;
