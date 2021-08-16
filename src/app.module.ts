import {Module} from '@nestjs/common';
import {CommandModule} from './commands/command.module';
import {ReactionRolesModule} from './reaction-roles/reaction-roles.module';
import {MessengerModule} from './messenger/messenger.module';

@Module({
    imports: [
        CommandModule,
        ReactionRolesModule,
        MessengerModule,
    ],
})
export class AppModule {
}
