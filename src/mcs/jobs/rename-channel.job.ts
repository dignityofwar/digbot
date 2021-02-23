import {DelayedJob} from '../../utils/delayed-job';
import {Injectable} from '@nestjs/common';
import {ModularChannelService} from '../modular-channel.service';
import {GroupState} from '../states/group.state';
import {RENAMING_DELAY} from '../modular-channel.constants';

@Injectable()
export class RenameChannel extends DelayedJob<void> {
    constructor(
        private readonly modularChannelService: ModularChannelService,
        private readonly state: GroupState,
    ) {
        super(RENAMING_DELAY, true);
    }

    protected async execute(): Promise<void> {
        // TODO: Rename channel
    }
}