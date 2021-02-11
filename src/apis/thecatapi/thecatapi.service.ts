import {HttpService, Injectable} from '@nestjs/common';
import {ImageSearchOptions} from './interfaces/images/search.options';
import {ImageSchema} from './interfaces/images/image.schema';

@Injectable()
export class TheCatApiService {
    constructor(
        private readonly httpService: HttpService,
    ) {
    }

    imagesSearch(options?: ImageSearchOptions) {
        const params: any = {...options};
        if (options.mime_types) params.mime_types = options.mime_types.join(',');
        if (options.category_ids) params.category_ids = options.category_ids.join(',');

        return this.httpService.get<ImageSchema[]>('images/search', {params});
    }
}
