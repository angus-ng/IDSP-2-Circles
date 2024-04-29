import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import{ AuthenticationService } from "../../services/Authentication.service";

import { IStrategy } from '../../../../interfaces/strategy.interface';
import User from "../../../../interfaces/user.interface";

const db = new AuthenticationService()

const localStrategy = new LocalStrategy(
  {
    usernameField: "email", 
    passwordField: "password",
  },
  (email, password, done) => {
    const userOrErr = db.getUserByEmailAndPassword(email, password);
    if (typeof userOrErr === "string") {
      done(null, false, {message: userOrErr})
    } else {
      done (null, userOrErr)
    }
  }
);

const passportLocalStrategy: IStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;