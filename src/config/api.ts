import { getBool } from '../utils/env';

export default class Api {
    public readonly enabled: boolean = getBool('API_ENABLED');
}
