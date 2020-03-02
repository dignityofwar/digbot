import { ContainerModule } from 'inversify';

export default interface AppContract {
    readonly environment: string;

    readonly debug: boolean;

    readonly modules: ContainerModule[];
}

export const APPCONTRACT = Symbol.for('config.contracts.AppContract');
