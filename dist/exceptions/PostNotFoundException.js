"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
class PostNotFoundException extends HttpException_1.default {
    constructor(id) {
        super(404, `Post with id ${id} not found`);
    }
}
exports.default = PostNotFoundException;
