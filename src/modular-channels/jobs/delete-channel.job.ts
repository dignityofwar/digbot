import {DelayedJob} from '../../utils/delayed-job';
import {Injectable} from '@nestjs/common';
import {GroupState} from '../states/group.state';
import {DELETION_DELAY} from '../modular-channel.constants';
import {ChannelAllocationService} from '../services/channel-allocation.service';

@Injectable()
export class DeleteChannel extends DelayedJob<void> {
    constructor(
        private readonly allocationService: ChannelAllocationService,
        private readonly state: GroupState,
    ) {
        super(DELETION_DELAY, true);
    }

    protected async execute(): Promise<void> {
        await this.allocationService.delete(this.state);
    }
}