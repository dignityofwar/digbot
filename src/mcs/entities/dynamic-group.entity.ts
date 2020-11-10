import { DynamicChannelEntity } from './dynamic-channel.entity';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class DynamicGroupEntity {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @OneToMany(() => DynamicChannelEntity, 'group')
    channels: DynamicChannelEntity[];

    @Column()
    format: string;
}
