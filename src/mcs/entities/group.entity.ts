import {Channel} from './channel.entity';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import Timeout = NodeJS.Timeout;
import {Guild} from 'discord.js';
import {JobType} from '../modular-channel.service';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    snowflake: string;

    @Column()
    format: string;

    @Column()
    parent: string;

    @Column({type: 'int'})
    minFreeChannels: number;

    @Column({type: 'int'})
    maxChannels: number;

    @Column({default: 5 * 60})
    deletionDelay: number;

    @Column({default: 10})
    creationDelay: number;

    @OneToMany(() => Channel, 'group', {eager: true, cascade: true})
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
            this.channels.length - this.maxChannels
        );
    }

    get nextName(): string {
        return this.format;
    }

    get nextPosition(): number {
        return 25;
    }
}
