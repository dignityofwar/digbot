import { Module } from '@nestjs/common';
import { DiscordModule } from './modules/discord.module';

@Module({
    imports: [
        DiscordModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
