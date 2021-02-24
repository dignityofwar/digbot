import {DelayedJob} from '../../utils/delayed-job';
import {Injectable} from '@nestjs/common';
import {RENAMING_DELAY} from '../modular-channel.constants';
import {ChannelState} from '../states/channel.state';
import {ChannelNamingService} from '../services/channel-naming.service';

@Injectable()
export class RenameChannel extends DelayedJob<void> {
    constructor(
        private readonly namingService: ChannelNamingService,
        private readonly state: ChannelState,
    ) {
        super(RENAMING_DELAY, true);
    }

    protected async execute(): Promise<void> {
        await this.namingService.renameChannel(this.state);
    }
}