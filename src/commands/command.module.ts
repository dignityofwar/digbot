import {Module} from '@nestjs/common';
import {TheCatApiModule} from '../apis/thecatapi/thecatapi.module';
import {CatsController} from './cats.controller';
import {CommandCoreModule} from './foundation/command-core.module';

@Module({
    imports: [
        CommandCoreModule,
        TheCatApiModule,
    ],
    controllers: [
        CatsController,
    ],
})
export class CommandModule {
}
