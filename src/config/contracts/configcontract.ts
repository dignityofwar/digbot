import AppContract from './appcontract';
import DatabaseContract from './databasecontract';
import DiscordContract from './discordcontract';
import LoggingContract from './loggingcontract';

export default interface ConfigContract {
    readonly app: AppContract;
    readonly database: DatabaseContract;
    readonly discord: DiscordContract;
    readonly logging: LoggingContract;
}

export const CONFIGCONTRACT = Symbol.for('config.contracts.ConfigContract');
