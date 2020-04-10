import { injectable } from 'inversify';
import axios, { AxiosInstance } from 'axios';

@injectable()
export default class JService {
    /**
     * An Axios instance with the base configuration for JService
     *
     * @type {AxiosInstance} The Axios instance
     */
    private axios: AxiosInstance = axios.create({
        baseURL: 'http://jservice.io/api',
    });

    public async random(): Promise<JServiceTrivia> {
        return this.axios.get('random')
            .then(({data: [trivia]}) => this.convertToJServiceTrivia(trivia));
    }

    private convertToJServiceTrivia(trivia: any): JServiceTrivia {
        trivia.airdate = new Date(trivia.airdate);
        trivia.created_at = new Date(trivia.created_at);
        trivia.updated_at = new Date(trivia.updated_at);
        trivia.category.created_at = new Date(trivia.category.created_at);
        trivia.category.updated_at = new Date(trivia.category.updated_at);

        return trivia;
    }
}

export interface JServiceTrivia {
    id: number;
    answer: string;
    question: string;
    value?: string;
    airdate: Date;
    created_at: Date;
    updated_at: Date;
    category_id: number;
    game_id?: number;
    invalid_count?: number;
    category: {
        id: number;
        title: string;
        created_at: Date;
        updated_at: Date;
        clues_count: number;
    };
}
