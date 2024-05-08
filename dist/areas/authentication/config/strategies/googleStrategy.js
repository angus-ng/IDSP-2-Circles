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
const Authentication_service_1 = require("../../services/Authentication.service");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db = new Authentication_service_1.AuthenticationService();
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: "http://localhost:5000/auth/google/callback",
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db.findOrCreateGoogle(profile);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
const passportGoogleStrategy = {
    name: 'google',
    strategy: googleStrategy,
};
exports.default = passportGoogleStrategy;
