import LoggingContract from './contracts/loggingcontract';

export default class Logging implements LoggingContract {
    public readonly level: string = process.env.LOG_LEVEL ?? 'info';

    public readonly driver: string | string[];

    public readonly drivers: any = {

    };
}
