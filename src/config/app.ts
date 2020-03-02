import AppContract from './contracts/appcontract';
import { ContainerModule, injectable } from 'inversify';
import { botModule } from '../bot';
import { databaseModule } from '../database';
import { commandModule } from '../commands';
import { statsModule } from '../stats';

@injectable()
export default class App implements AppContract {
    /**
     * @type {boolean} Set to true when developing the application, this will provide more information for debugging
     */
    public readonly debug: boolean = /^true$/i.test(process.env.DEBUG?.trim() ?? '');

    public readonly modules: ContainerModule[] = [
        databaseModule,
        botModule,
        commandModule,
        statsModule,
    ];
}

export const appConfig = new App();
