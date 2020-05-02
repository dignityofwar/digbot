import { ClientOpts } from 'redis';
import { get, getInt } from '../utils/env';

export default class Redis {
    public readonly port: number = getInt('REDIS_PORT', 6379);

    public readonly host: string = get('REDIS_HOST', 'localhost');

    public readonly options: ClientOpts = {};
}
