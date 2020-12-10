import { DynamicChannelEntity } from './dynamic-channel.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DynamicGroupEntity {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @OneToMany(() => DynamicChannelEntity, 'group')
    channels: DynamicChannelEntity[];

    @Column()
    format: string;

    @Column()
    minChannels: number;

    @Column()
    maxChannels: number;
}
