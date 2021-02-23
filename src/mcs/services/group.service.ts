import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Group} from '../entities/group.entity';
import {Injectable} from '@nestjs/common';
import {Channel} from '../entities/channel.entity';
import {remove} from '../../utils/array.utils';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
    ) {
    }

    async getAll(): Promise<Group[]> {
        const groups = await this.groupRepository.find({relations: ['channels']});

        for (const group of groups)
            for (const channel of group.channels)
                channel.group = group;

        return groups;
    }

    createGroup(data: Omit<Group, 'id' | 'channels' | 'createdAt' | 'updatedAt'>): Promise<Group> {
        const group = this.groupRepository.create(data);

        return this.groupRepository.save(group);
    }

    updateGroup(group: Group, data: Partial<Omit<Group, 'id' | 'channels' | 'createdAt' | 'updatedAt'>>): void {
        Object.assign(group, data);

        void this.groupRepository.save(group);
    }

    deleteGroup(group: Group): void {
        void this.groupRepository.remove(group);
    }

    async createChannel(data: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Channel> {
        const channel = await this.channelRepository.save(
            this.channelRepository.create(data),
        );
        data.group.channels.push(channel);

        return channel;
    }

    deleteChannel(channel: Channel): void {
        remove(channel.group.channels, channel);

        void this.channelRepository.remove(channel);
    }
}
