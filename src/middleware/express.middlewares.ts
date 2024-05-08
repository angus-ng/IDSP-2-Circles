import express, { Application } from "express";
import path from "path";
import session from "express-session";
import morgan from "morgan";
import Redis from "ioredis";
const RedisStore = require("connect-redis").default

module.exports = (app : Application) => {
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("tiny"));

  if (process.env.NODE_ENV === "production") {
    const redisClient = new Redis({
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD
    });

    redisClient.on("connect", () => console.log("Redis Connected"))

    let redisStore = new RedisStore({
      client: redisClient,
      prefix: "myapp:",
    })

    app.use(
      session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store: redisStore,
        cookie: {
          httpOnly: true,
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );
  } else {
    console.log("using memory store")
    app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );
  }
};
