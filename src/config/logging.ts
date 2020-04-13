export default class Logging {
    public readonly level: string = process.env.LOG_LEVEL ?? 'info';

    public readonly driver: string | string[];

    public readonly drivers: any = {};
}
