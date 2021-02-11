import {Column, Entity, PrimaryColumn} from 'typeorm';
import {TextChannel} from 'discord.js';

@Entity()
export class LogSettings {
    @PrimaryColumn()
    guild: string;

    @Column()
    channel: string;

    textChannel: TextChannel;
}
