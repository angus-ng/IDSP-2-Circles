"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passportConfigs_1 = __importDefault(require("../areas/authentication/config/passportConfigs"));
const authentication_middleware_1 = require("./authentication.middleware");
const localStrategy_1 = __importDefault(require("../areas/authentication/config/strategies/localStrategy"));
const facebookStrategy_1 = __importDefault(require("../areas/authentication/config/strategies/facebookStrategy"));
const googleStrategy_1 = __importDefault(require("../areas/authentication/config/strategies/googleStrategy"));
// passportConfig.registerStrategy(passport);
module.exports = (app) => {
    new passportConfigs_1.default([localStrategy_1.default, facebookStrategy_1.default, googleStrategy_1.default]);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(authentication_middleware_1.setCurrentUser);
};
