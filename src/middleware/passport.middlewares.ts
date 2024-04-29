import passport from "passport";
//import PassportConfig from "../areas/authentication/config/PassportConfig";
import { setCurrentUser } from "./authentication.middleware";
//import { AuthenticationService } from "../areas/authentication/services";
import { Application } from "express";

// passportConfig.registerStrategy(passport);

// TODO: Replace any with the correct type
module.exports = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());
  //new PassportConfig("local", new AuthenticationService());
  app.use(setCurrentUser);
};
 