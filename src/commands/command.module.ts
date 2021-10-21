import {Module} from '@nestjs/common';
import {TheCatApiModule} from '../apis/thecatapi/thecatapi.module';
import {CatsController} from './controllers/cats.controller';
import {CommandCoreModule} from './foundation/command-core.module';

@Module({
    imports: [
        CommandCoreModule,
        TheCatApiModule,
    ],
    providers: [
        CatsController,
    ],
})
export class CommandModule {
}
