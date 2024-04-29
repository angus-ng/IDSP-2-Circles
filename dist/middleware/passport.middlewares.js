"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
//import PassportConfig from "../areas/authentication/config/PassportConfig";
const authentication_middleware_1 = require("./authentication.middleware");
// passportConfig.registerStrategy(passport);
// TODO: Replace any with the correct type
module.exports = (app) => {
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    //new PassportConfig("local", new AuthenticationService());
    app.use(authentication_middleware_1.setCurrentUser);
};
