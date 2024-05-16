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
exports.getLocalUser = void 0;
const kinde_1 = require("../areas/authentication/config/kinde");
const kinde_2 = require("../areas/authentication/config/kinde");
function getLocalUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let loggedInUser;
        if (req.user)
            (loggedInUser = req.user.username);
        if (!loggedInUser) {
            loggedInUser = (yield kinde_2.kindeClient.getUser((0, kinde_1.sessionManager)(req, res))).id;
        }
        console.log(loggedInUser);
        return loggedInUser;
    });
}
exports.getLocalUser = getLocalUser;
