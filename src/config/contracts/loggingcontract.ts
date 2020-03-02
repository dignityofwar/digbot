export default interface LoggingContract {
    readonly level: string;
    readonly driver: string | string[];
    readonly drivers: any;
}

export const LOGGINGCONTRACT = Symbol.for('config.contracts.LoggingContract');
