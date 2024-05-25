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
exports.getLocalUser = void 0;
const kinde_1 = require("../areas/authentication/config/kinde");
const kinde_2 = require("../areas/authentication/config/kinde");
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const db = PrismaClient_1.default.getInstance();
function getLocalUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let loggedInUser;
        if (req.user)
            (loggedInUser = req.user.username);
        if (!loggedInUser) {
            const kindeUserId = (yield kinde_2.kindeClient.getUser((0, kinde_1.sessionManager)(req, res))).id;
            const user = yield db.prisma.user.findUnique({
                where: { id: kindeUserId }
            });
            loggedInUser = user === null || user === void 0 ? void 0 : user.username;
        }
        return loggedInUser;
    });
}
exports.getLocalUser = getLocalUser;
