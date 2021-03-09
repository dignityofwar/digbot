import {Controller} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {JoinMessenger} from '../entities/join-messenger.entity';
import {Command} from '../../commands/foundation/decorators/command.decorator';
import {CommandRequest} from '../../commands/foundation/command.request';

@Controller()
export class JoinSettingsController {
    constructor(
        @InjectRepository(JoinMessenger)
        private readonly joinRepository: Repository<JoinMessenger>,
    ) {
    }

    @Command({
        adminOnly: true,
        command: '!',
        description: '',
    })
    setJoinDM({}: CommandRequest) {
    }

    @Command({
        adminOnly: true,
        command: '!',
        description: '',
    })
    removeJoinDM({}: CommandRequest) {

    }

    @Command({
        adminOnly: true,
        command: '!',
        description: '',
    })
    setJoin({}: CommandRequest) {
    }

    @Command({
        adminOnly: true,
        command: '!',
        description: '',
    })
    removeJoin({}: CommandRequest) {
    }
}
