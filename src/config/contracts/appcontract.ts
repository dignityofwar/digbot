export default interface AppContract {
    readonly debug: boolean;
}

export const APPCONTRACT = Symbol.for('config.contracts.AppContract');
