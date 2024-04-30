"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
class PassportConfig {
    addStrategies(strategies) {
        strategies.forEach((passportStrategy) => {
            passport_1.default.use(passportStrategy.name, passportStrategy.strategy);
        });
    }
    constructor(strategies) {
        this.addStrategies(strategies);
    }
}
exports.default = PassportConfig;
