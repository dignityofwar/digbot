import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('logger_settings')
export class LogSettings {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    guildId: string;

    @Column()
    channelId: string;
}
