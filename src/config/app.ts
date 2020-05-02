import { ContainerModule } from 'inversify';
import { getBool } from '../utils/env';

function _(id: string): ContainerModule {
    return require(id).default;
}

export default class App {
    /**
     * @type {string} The current environment the bot is running in
     */
    public readonly environment: string = process.env.NODE_ENV ?? 'development';

    /**
     * @type {boolean} Set to true when developing the application, this will provide more information for debugging
     */
    public readonly debug: boolean = getBool('DEBUG');

    /**
     * @return {ContainerModule[]} Modules used by the app
     */
    public readonly modules = (): ContainerModule[] => ([
        _('../database'),
        _('../bot'),
        _('../commands'),
    ]);
}
