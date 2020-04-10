import App, { appConfig } from './app';
import Logging, { loggingConfig } from './logging';
import Database, { databaseConfig } from './database';
import Discord, { discordConfig } from './discord';

/**
 * Holds the main configuration of the application
 */
export default class Config {
    public readonly app: App = appConfig;
    public readonly database: Database = databaseConfig;
    public readonly discord: Discord = discordConfig;
    public readonly logging: Logging = loggingConfig;
}

export const config = new Config();

