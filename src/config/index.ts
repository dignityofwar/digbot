import { injectable } from 'inversify';
import App from './app';
import Logging from './logging';

/**
 * Holds the main configuration of the application
 */
@injectable()
export default class Config {
    public readonly app: App = new App();
    public readonly logging: Logging = new Logging();
}

export const config = new Config();
