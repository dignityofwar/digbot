import App from './app';
import Logging from './logging';
import Database from './database';
import Discord from './discord';
import Api from './api';
import Features from './features';
import Redis from './redis';

/**
 * Holds the main configuration of the application
 */
export class Config {
    public readonly api: Api = new Api();
    public readonly app: App = new App();
    public readonly database: Database = new Database();
    public readonly discord: Discord = new Discord();
    public readonly features: Features = new Features();
    public readonly logging: Logging = new Logging();
    public readonly redis: Redis = new Redis();
}

export default new Config();

