"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
require("dotenv/config");
// import  Redis  from "ioredis";
// import connectRedis from "connect-redis";
// const RedisStore = connectRedis(session);
// const redisClient = new Redis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   username: "default", // optional
//   password: process.env.REDIS_PASSWORD, // optional
//   db: 0, //optional
// });
module.exports = (app) => {
    app.set("views", path_1.default.join(__dirname, "..", "areas"));
    app.set('view engine', 'ejs');
    app.use((0, connect_livereload_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)("tiny"));
    app.use((0, express_session_1.default)({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        // store: new RedisStore({client: redisClient}),
        cookie: {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production" ? true : false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    }));
};
