"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrentUser = exports.forwardAuthenticated = exports.ensureAuthenticated = void 0;
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
    return;
};
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
