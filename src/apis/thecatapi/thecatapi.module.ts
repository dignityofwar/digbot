import {Module} from '@nestjs/common';
import {TheCatApiService} from './thecatapi.service';
import {HttpModule} from '@nestjs/axios';

@Module({
    imports: [
        HttpModule.register({baseURL: 'https://api.thecatapi.com/v1'}),
    ],
    providers: [TheCatApiService],
    exports: [TheCatApiService],
})
export class TheCatApiModule {
}
