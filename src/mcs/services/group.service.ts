import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Group} from '../entities/group.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) {
    }

    async getAll(): Promise<Group[]> {
        const groups = await this.groupRepository.find({relations: ['channels']});

        groups.forEach(group => {
            group.channels.forEach(channel => {
                channel.group = group
            });
        });

        return groups;
    }
}
