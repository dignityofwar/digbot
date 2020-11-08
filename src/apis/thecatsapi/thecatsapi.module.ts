import { HttpModule, Module } from '@nestjs/common';
import { TheCatsApiService } from './thecatsapi.service';

@Module({
    imports: [
        HttpModule.register({baseURL: 'https://api.thecatsapi.com/v1'}),
    ],
    providers: [TheCatsApiService],
    exports: [TheCatsApiService],
})
export class TheCatsApiModule {
}
