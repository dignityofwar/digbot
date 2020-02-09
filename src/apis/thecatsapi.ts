import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';

/**
 * A module to make request to the Cat Api
 */
@injectable()
export default class TheCatsApi {
    /**
     * An Axios instance with the base configuration for the Cat Api
     */
    private axios: AxiosInstance = axios.create({
        baseURL: 'https://api.thecatapi.com/v1',
    });

    /**
     * Retrieves the url of a random static cat image
     */
    public async getImg(): Promise<string> {
        return this.axios.get('images/search', {
            params: {
                limit: 1,
                mime_types: 'jpg,png', // eslint-disable-line @typescript-eslint/camelcase
            },
        }).then(({data: [{url}]}) => url);
    }

    /**
     * Retrieves the url of a random gif cat image
     */
    public async getGif(): Promise<string> {
        return this.axios.get('images/search', {
            params: {
                limit: 1,
                mime_types: 'gif', // eslint-disable-line @typescript-eslint/camelcase
            },
        }).then(({data: [{url}]}) => url);
    }
}
