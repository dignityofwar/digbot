import {CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Group} from './group.entity';
import {VoiceChannel} from 'discord.js';

@Entity()
export class Channel {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Group, 'channels', {onDelete: 'CASCADE'})
    group: Group;

    voiceChannel: VoiceChannel;

    get isEmpty(): boolean {
        return this.voiceChannel.members.size == 0;
    }

    removeFromGroup(): boolean {
        return this.group.removeChannel(this);
    }
}
