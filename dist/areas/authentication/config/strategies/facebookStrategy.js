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
const passport_facebook_1 = require("passport-facebook");
const Authentication_service_1 = require("../../services/Authentication.service");
require("dotenv/config");
const db = new Authentication_service_1.AuthenticationService();
const facebookStrategy = new passport_facebook_1.Strategy({
    clientID: String(process.env.FACEBOOK_APP_ID),
    clientSecret: String(process.env.FACEBOOK_APP_SECRET),
    callbackURL: "https://idsp-2-circles.onrender.com/auth/facebook/callback",
    profileFields: ["id", "displayName", "picture.type(large)"]
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db.findOrCreateFB(profile);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
const passportFacebookStrategy = {
    name: 'facebook',
    strategy: facebookStrategy,
};
exports.default = passportFacebookStrategy;
