import { AuthenticationService } from '../../services/Authentication.service';
import { IStrategy } from '../../../../interfaces/strategy.interface';
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { VerifyCallback } from 'passport-oauth2';

const db = new AuthenticationService()

const googleStrategy = new GoogleStrategy({
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: "http://localhost:5000/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken:string, refreshToken:string, profile:Profile, done:VerifyCallback) => {
    try {
        const user = await db.findOrCreateGoogle(profile)
        done(null, user)
    } catch (error:any) {
        done(error)
    }
  }
);

const passportGoogleStrategy: IStrategy = {
    name: 'google',
    strategy: googleStrategy,
};
  
export default passportGoogleStrategy;