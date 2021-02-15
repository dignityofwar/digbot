import {DelayedJob} from '../../utils/delayed-job';
import {Injectable} from '@nestjs/common';
import {ModularChannelService} from '../modular-channel.service';
import {GroupState} from '../states/group.state';

@Injectable()
export class RenameChannel extends DelayedJob {
    constructor(
        private readonly modularChannelService: ModularChannelService,
        private readonly state: GroupState,
    ) {
        super(state.group.creationDelay * 1000, true);
    }

    protected async execute(): Promise<void> {
        await this.modularChannelService.deleteChannel(this.state);
    }
}