import { Strategy as LocalStrategy } from "passport-local";
import{ AuthenticationService } from "../../services/Authentication.service";
import { IStrategy } from '../../../../interfaces/strategy.interface';
import { VerifyCallback } from "passport-google-oauth20";
import passport from "passport";
import { User as IUser} from "@prisma/client";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

const db = new AuthenticationService()

const localStrategy = new LocalStrategy(
  {
    usernameField: "email", 
    passwordField: "password",
  },
  async (email: string, password: string, done: VerifyCallback) => {
    try {
      const user = await db.getUserByEmailAndPassword(email, password);
      console.log(user)
      done (null, user)
    } catch (error: any) {
      done(error)
    }
  }
);

const passportLocalStrategy: IStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;