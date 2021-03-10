import {DelayedJob} from '../../utils/delayed-job';
import {Injectable} from '@nestjs/common';
import {GroupState} from '../states/group.state';
import {CREATION_DELAY} from '../modular-channel.constants';
import {ChannelAllocationService} from '../services/channel-allocation.service';

@Injectable()
export class CreateChannel extends DelayedJob<void> {
    constructor(
        private readonly allocationService: ChannelAllocationService,
        private readonly state: GroupState,
    ) {
        super(CREATION_DELAY, true);
    }

    protected async execute(): Promise<void> {
        await this.allocationService.create(this.state);
    }
}