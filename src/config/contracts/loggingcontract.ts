export default interface LoggingContract {
    readonly level: string;
}

export const LOGGINGCONTRACT = Symbol.for('config.contracts.LoggingContract');
