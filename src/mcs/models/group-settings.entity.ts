import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('mcs_group_settings')
export class GroupSettings {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column({nullable: true})
    parentId?: string;

    @Column()
    initPosition: number;

    @Column()
    name: string;

    @Column()
    minFreeChannels: number;

    @Column()
    maxChannels: number;
}
