import passport, { PassportStatic } from 'passport';

import { IStrategy } from '../../../interfaces/strategy.interface';
import { AuthenticationService } from '../services/Authentication.service';

const db = new AuthenticationService()

export default class PassportConfig {

   private addStrategies(strategies: IStrategy[]): void {
       strategies.forEach((passportStrategy: IStrategy) => {
           passport.use(passportStrategy.name, passportStrategy.strategy);
           
        });
        passport.serializeUser(function(user: Express.User, done: (err: any, id: string) => void) {
         console.log("the user is: ");
         console.log(user.username);
         done(null, user.id);
        });
     
         passport.deserializeUser(async function(id: string, done) {
         try {
           const user = await db.getUserById(id);
           done(null, user);
         } catch (error) {
           done(error, null);
         }
       });
    }
    constructor(strategies: IStrategy[]) {
        this.addStrategies(strategies)
    }
}