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
exports.sessionManager = exports.kindeClient = void 0;
const kinde_typescript_sdk_1 = require("@kinde-oss/kinde-typescript-sdk");
// Client for authorization code flow
exports.kindeClient = (0, kinde_typescript_sdk_1.createKindeServerClient)(kinde_typescript_sdk_1.GrantType.AUTHORIZATION_CODE, {
    authDomain: process.env.KINDE_DOMAIN,
    clientId: process.env.KINDE_CLIENT_ID,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    redirectURL: process.env.KINDE_REDIRECT_URI,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI
});
const sessionManager = (req, res) => ({
    getSessionItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = req.session) === null || _a === void 0 ? void 0 : _a[key];
        });
    },
    setSessionItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session[key] = value;
        });
    },
    removeSessionItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.session[key];
        });
    },
    destroySession() {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                }
            });
        });
    },
});
exports.sessionManager = sessionManager;
