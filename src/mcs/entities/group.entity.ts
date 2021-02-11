import {Channel} from './channel.entity';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Guild} from 'discord.js';
import {JobType} from '../modular-channel.service';
import Timeout = NodeJS.Timeout;

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    guildId: string;

    @Column()
    format: string;

    @Column()
    parentId?: string;

    @Column()
    position: number;

    @Column()
    userLimit?: number;

    @Column({type: 'int'})
    minFreeChannels: number;

    @Column({type: 'int'})
    maxChannels: number;

    @Column({default: 5 * 60})
    deletionDelay: number;

    @Column({default: 10})
    creationDelay: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Channel, 'group', {eager: true, cascade: true, onDelete: 'CASCADE'})
    channels: Channel[];

    guild: Guild;

    queued?: [JobType, Timeout];

    get emptyChannels(): Channel[] {
        return this.channels.filter(({isEmpty}) => isEmpty);
    }

    removeChannel(channel: Channel): boolean {
        const idx = this.channels.indexOf(channel);
        if (idx > -1) this.channels.splice(idx, 1);

        return idx > -1;
    }

    get tare(): number {
        return Math.max(
            this.emptyChannels.length - this.minFreeChannels,
            this.channels.length - this.maxChannels,
        );
    }

    get nextName(): string {
        return this.format;
    }
}
