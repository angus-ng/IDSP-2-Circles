import passport from "passport";
import PassportConfig from "../areas/authentication/config/passportConfigs";
import { setCurrentUser } from "./authentication.middleware";
//import { AuthenticationService } from "../areas/authentication/services";
import { Application } from "express";
import localStrategy from "../areas/authentication/config/strategies/localStrategy"
import facebookStrategy from "../areas/authentication/config/strategies/facebookStrategy";
import GoogleStrategy from "../areas/authentication/config/strategies/googleStrategy";

// passportConfig.registerStrategy(passport);

module.exports = (app: Application) => {
  console.log("hi")
  new PassportConfig([localStrategy, facebookStrategy, GoogleStrategy]);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(setCurrentUser);
};
 