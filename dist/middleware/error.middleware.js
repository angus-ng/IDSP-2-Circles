"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const errorMiddleware = (error, request, response, next) => {
    const status = error.status || 500;
    const message = error.message || "An error has occured";
    const time = new Date();
    const logTime = time.toLocaleString();
    let logMessage = `${logTime} - ${status} - ${message}\n`;
    node_fs_1.default.appendFile("error.log", logMessage, (err) => {
        if (err) {
            console.error("Error writing to error.log:", err);
        }
    });
    console.log(logMessage);
};
exports.default = errorMiddleware;
