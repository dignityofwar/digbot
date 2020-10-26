import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';

@Module({
    controllers: [CommandController]
})
export class CommandModule {
}
