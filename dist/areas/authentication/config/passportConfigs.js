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
const passport_1 = __importDefault(require("passport"));
const Authentication_service_1 = require("../services/Authentication.service");
const db = new Authentication_service_1.AuthenticationService();
class PassportConfig {
    addStrategies(strategies) {
        strategies.forEach((passportStrategy) => {
            passport_1.default.use(passportStrategy.name, passportStrategy.strategy);
        });
        passport_1.default.serializeUser(function (user, done) {
            done(null, user.id);
        });
        passport_1.default.deserializeUser(function (id, done) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield db.getUserById(id);
                    done(null, user);
                }
                catch (error) {
                    done(error, null);
                }
            });
        });
    }
    constructor(strategies) {
        this.addStrategies(strategies);
    }
}
exports.default = PassportConfig;
