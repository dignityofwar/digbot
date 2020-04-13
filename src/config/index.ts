import App from './app';
import Logging from './logging';
import Database from './database';
import Discord from './discord';

/**
 * Holds the main configuration of the application
 */
export class Config {
    private _app: App;
    private _database: Database;
    private _discord: Discord;
    private _logging: Logging;

    public app(): App {
        if (!this._app)
            this._app = new App();

        return this._app;
    }

    public database(): Database {
        if (!this._database)
            this._database = new Database();

        return this._database;
    }

    public discord(): Discord {
        if (!this._discord)
            this._discord = new Discord();

        return this._discord;
    }

    public logging(): Logging {
        if (!this._logging)
            this._logging = new Logging();

        return this._logging;
    }
}

export default new Config();

