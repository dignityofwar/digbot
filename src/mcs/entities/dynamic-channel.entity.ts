import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DynamicGroupEntity } from './dynamic-group.entity';

@Entity()
export class DynamicChannelEntity {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    channel: string;

    @Column()
    group?: DynamicGroupEntity;

    @Column()
    removable: boolean;
}
