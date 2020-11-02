import { Module } from '@nestjs/common';
import { CommandModule } from './commands/command.module';

@Module({
    imports: [
        CommandModule,
    ],
})
export class AppModule {
}
