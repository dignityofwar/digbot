import { ContainerModule, injectable, interfaces } from 'inversify';
import App, { appConfig } from './app';
import Logging, { loggingConfig } from './logging';
import Database, { databaseConfig } from './database';
import Discord, { discordConfig } from './discord';
import ConfigContract, { CONFIGCONTRACT } from './contracts/configcontract';
import Bind = interfaces.Bind;
import AppContract, { APPCONTRACT } from './contracts/appcontract';
import DatabaseContract, { DATABASECONTRACT } from './contracts/databasecontract';
import DiscordContract, { DISCORDCONTRACT } from './contracts/discordcontract';
import LoggingContract, { LOGGINGCONTRACT } from './contracts/loggingcontract';

/**
 * Holds the main configuration of the application
 */
@injectable()
export default class Config implements ConfigContract {
    public constructor(
        public readonly app: App,
        public readonly database: Database,
        public readonly discord: Discord,
        public readonly logging: Logging,
    ) {
    }
}

export const config = new Config(appConfig, databaseConfig, discordConfig, loggingConfig);

export const configModule = new ContainerModule((bind: Bind) => {
    bind<ConfigContract>(CONFIGCONTRACT).toConstantValue(config);
    bind<AppContract>(APPCONTRACT).toConstantValue(appConfig);
    bind<DatabaseContract>(DATABASECONTRACT).toConstantValue(databaseConfig);
    bind<DiscordContract>(DISCORDCONTRACT).toConstantValue(discordConfig);
    bind<LoggingContract>(LOGGINGCONTRACT).toConstantValue(loggingConfig);
});
