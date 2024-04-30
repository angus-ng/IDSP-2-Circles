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
exports.AuthenticationService = void 0;
const PrismaClient_1 = __importDefault(require("../../../PrismaClient"));
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const salt = 12;
class AuthenticationService {
    constructor() {
        this._db = PrismaClient_1.default.getInstance();
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
        });
    }
    getUserByEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._db.prisma.user.findUnique({
                    where: {
                        email: email,
                    }
                });
                if (yield (0, bcrypt_1.compare)(password, user.password)) {
                    return user;
                }
                throw new Error("Password incorrect");
            }
            catch (error) {
                throw new Error("No email in our database");
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkEmail = yield this._db.prisma.user.findUnique({ where: { email: user.email } });
            const checkUsername = yield this._db.prisma.user.findUnique({ where: { username: user.username } });
            try {
                if (checkEmail) {
                    throw new Error(`The email ${user.email} existed ❌`);
                }
                else if (checkUsername) {
                    throw new Error(`The username ${user.username} existed ❌`);
                }
                user.password = yield (0, bcrypt_1.hash)(user.password, salt);
                const newUser = Object.assign({ id: (0, crypto_1.randomUUID)() }, user);
                const User = yield this._db.prisma.user.create({ data: newUser });
                console.log(User);
                return User;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.prisma.user.findUnique({ where: { id: id } });
        });
    }
}
exports.AuthenticationService = AuthenticationService;
