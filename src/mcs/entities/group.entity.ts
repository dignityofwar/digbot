import {Channel} from './channel.entity';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    guildId: string;

    @Column({nullable: true})
    parentId?: string;

    @Column()
    position: number;

    @Column()
    format: string;

    @Column({nullable: true})
    userLimit?: number;

    @Column()
    minFreeChannels: number;

    @Column()
    maxChannels: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Channel, 'group', {eager: false, cascade: false})
    channels: Channel[];
}
