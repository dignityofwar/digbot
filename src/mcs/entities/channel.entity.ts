import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Group} from './group.entity';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({unique: true})
    channelId: string;

    // @Column()
    // order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Group, 'channels', {eager: false, onDelete: 'CASCADE'})
    group: Group;
}
