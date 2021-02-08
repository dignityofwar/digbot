import {Injectable} from '@nestjs/common';
import {MCCEvents, ModularChannelContainer} from '../modular-channel.container';
import {InjectRepository} from '@nestjs/typeorm';
import {Group} from '../entities/group.entity';
import {Repository} from 'typeorm';

@Injectable()
export class SyncService {
    constructor(
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        container: ModularChannelContainer,
    ) {
        container.on(MCCEvents.SAVE, group => this.save(group));
        container.on(MCCEvents.DESTROY, group => this.destroy(group));
    }

    save(group: Group): void {
        void this.groupRepository.save(group);
    }

    destroy(group: Group): void {
        void this.groupRepository.remove(group);
    }
}