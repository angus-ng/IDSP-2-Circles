import passport from 'passport';

import { IStrategy } from '../../../interfaces/strategy.interface';

export default class PassportConfig {

   private addStrategies(strategies: IStrategy[]): void {
       strategies.forEach((passportStrategy: IStrategy) => {
           passport.use(passportStrategy.name, passportStrategy.strategy);
        });
    }
    constructor(strategies: IStrategy[]) {
        this.addStrategies(strategies)
    }
}