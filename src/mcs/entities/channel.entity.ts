import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Group} from './group.entity';
import {VoiceChannel} from 'discord.js';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    snowflake: string;

    @ManyToOne(() => Group, 'channels', {onDelete: 'CASCADE'})
    group: Group;

    channel: VoiceChannel;

    get isEmpty(): boolean {
        return this.channel.members.size == 0;
    }

    removeFromGroup(): boolean {
        return this.group.removeChannel(this);
    }
}
