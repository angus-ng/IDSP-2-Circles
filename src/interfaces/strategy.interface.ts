import { Strategy } from 'passport';

export interface IStrategy {
    name: string;
    strategy: Strategy;
}