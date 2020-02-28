import AppContract from './contracts/appcontract';
import { ContainerModule } from 'inversify';
import { configModule } from './index';
import { botModule } from '../bot';
import { databaseModule } from '../database';
import { commandModule } from '../commands';
import { statsModule } from '../stats';

export default class App implements AppContract {
    /**
     * @type {boolean} Set to true when developing the application, this will provide more information for debugging
     */
    public readonly debug: boolean = /^true$/i.test(process.env.DEBUG?.trim() ?? '');

    public readonly modules: ContainerModule[] = [
        configModule,
        botModule,
        databaseModule,
        commandModule,
        statsModule,
    ];
}
