import passport from "passport";
import PassportConfig from "../areas/authentication/config/passportConfigs";
import { setCurrentUser } from "./authentication.middleware";
//import { AuthenticationService } from "../areas/authentication/services";
import { Application } from "express";
import localStrategy from "../areas/authentication/config/strategies/localStrategy"

// passportConfig.registerStrategy(passport);



// TODO: Replace any with the correct type
module.exports = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());
  new PassportConfig([localStrategy]);
  app.use(setCurrentUser);
};
 