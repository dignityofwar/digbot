import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';

@injectable()
export default class TheCatsApi {
    private axios: AxiosInstance = axios.create({
        baseURL: 'https://api.thecatapi.com/v1',
    });

    public async getImg(): Promise<string> {
        return this.axios.get('images/search', {
            params: {
                limit: 1,
                mime_types: 'jpg,png', // eslint-disable-line @typescript-eslint/camelcase
            },
        }).then(({data: [{url}]}) => url);
    }

    public async getGif(): Promise<string> {
        return this.axios.get('images/search', {
            params: {
                limit: 1,
                mime_types: 'gif', // eslint-disable-line @typescript-eslint/camelcase
            },
        }).then(({data: [{url}]}) => url);
    }
}
