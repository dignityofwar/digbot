import {Snowflake} from 'discord.js';
import {Group} from './entities/group.entity';
import {Channel} from './entities/channel.entity';
import {EventEmitter} from 'events';

export enum MCCEvents {
    SAVE = 'save',
    DESTROY = 'destroy'
}

export class ModularChannelContainer extends EventEmitter {
    private readonly groups = new Set<Group>();
    private readonly channels = new Map<Snowflake, Channel>();

    initGroup(group: Group): void {
        this.groups.add(group);
        group.channels.forEach(channel => this.channels.set(channel.snowflake, channel));

        this.emit(MCCEvents.SAVE, group);
    }

    getChannel(snowflake: string): Channel | undefined {
        return this.channels.get(snowflake);
    }

    removeGroup(group: Group): boolean {
        group.channels.forEach(({snowflake}) => this.channels.delete(snowflake));
        const result = this.groups.delete(group);

        this.emit(MCCEvents.DESTROY, group);
        return result;
    }

    addChannel(channel: Channel): void {
        channel.group.channels.push(channel);
        this.channels.set(channel.snowflake, channel);

        this.emit(MCCEvents.SAVE, channel.group);
    }

    deleteChannel(channel: Channel): void {
        this.channels.delete(channel.snowflake);
        channel.group.removeChannel(channel);

        this.emit(MCCEvents.SAVE, channel.group);
    }
}
