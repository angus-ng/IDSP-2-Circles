import express, { Application } from "express";
import path from "path";
import session, { MemoryStore } from "express-session";
import morgan from "morgan";
import 'dotenv/config';

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

module.exports = (app : Application) => {
  app.set("views", path.join(__dirname, "..", "areas"));
  app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("tiny"));
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      // store: new RedisStore({client: redisClient}),
      cookie: {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );
};
