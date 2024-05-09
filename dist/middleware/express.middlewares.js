"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const ioredis_1 = __importDefault(require("ioredis"));
const RedisStore = require("connect-redis").default;
module.exports = (app) => {
    app.use(express_1.default.static("public"));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("tiny"));
    if (process.env.NODE_ENV === "production") {
        const redisClient = new ioredis_1.default({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD
        });
        redisClient.on("connect", () => console.log("Redis Connected"));
        let redisStore = new RedisStore({
            client: redisClient,
            prefix: "myapp:",
        });
        app.set("trust proxy", 1);
        app.use((0, express_session_1.default)({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: redisStore,
            proxy: true,
            name: "circlesSID",
            cookie: {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            },
        }));
    }
    else {
        console.log("using memory store");
        app.use((0, express_session_1.default)({
            secret: "keyboard cat",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000,
            },
        }));
    }
};
