import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import { VerifyCallback } from 'passport-oauth2';
import{ AuthenticationService } from "../../services/Authentication.service";
import { IStrategy } from '../../../../interfaces/strategy.interface';
import 'dotenv/config'

const db = new AuthenticationService()

const facebookStrategy = new FacebookStrategy(
  {
    clientID: String(process.env.FACEBOOK_APP_ID),
    clientSecret: String(process.env.FACEBOOK_APP_SECRET),
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ["id", "picture.type(large)"]
  },
  (accessToken: string, refreshToken: string, profile: Profile, done:VerifyCallback) => {
    console.log(profile)
    const userOrErr = db.findOrCreateFB(profile);
    if (typeof userOrErr === "string") {
      done(null, false, {message: userOrErr})
    } else {
      done (null, userOrErr)
    }
  }
);

const passportFacebookStrategy: IStrategy = {
  name: 'facebook',
  strategy: facebookStrategy,
};

export default passportFacebookStrategy;