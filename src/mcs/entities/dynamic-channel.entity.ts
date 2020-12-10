import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DynamicGroupEntity } from './dynamic-group.entity';

@Entity()
export class DynamicChannelEntity {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    channel: string;

    @ManyToOne(() => DynamicGroupEntity)
    group?: DynamicGroupEntity;

    @Column()
    removable: boolean;

    @Column()
    members?: number;
}
