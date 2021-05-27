import {Injectable} from '@nestjs/common';
import {VoiceChannel} from 'discord.js';
import {Group} from '../models/group';

@Injectable()
export class ChannelFactory {
    async create(group: Group, reason?: string): Promise<VoiceChannel> {
        return group.guild.channels.create(
            this.getName(group),
            {
                type: 'voice',
                parent: group.parent,
                position: this.getPosition(group),
                reason,
            },
        );
    }

    getName(group: Group): string {
        return group.naming.forNewChannel(group);
    }

    getPosition(group: Group): number {
        return group.channels.size == 0
            ? group.settings.initPosition
            : Array.from(group.channels)
                .reduce(
                    (position, {channel}) =>
                        position < channel.rawPosition ? channel.rawPosition : position,
                    0,
                );
    }
}
