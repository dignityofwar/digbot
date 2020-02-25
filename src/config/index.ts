import { ContainerModule, injectable, interfaces } from 'inversify';
import App from './app';
import Logging from './logging';
import Database from './database';
import Discord from './discord';
import ConfigContract, { CONFIGCONTRACT } from './contracts/configcontract';
import Bind = interfaces.Bind;

/**
 * Holds the main configuration of the application
 */
@injectable()
export default class Config implements ConfigContract {
    public readonly app: App = new App();
    public readonly database: Database = new Database();
    public readonly discord: Discord = new Discord();
    public readonly logging: Logging = new Logging();
}

export const config = new Config();

export const configModule = new ContainerModule((bind: Bind) => {
    bind<ConfigContract>(CONFIGCONTRACT).toConstantValue(config);
});
