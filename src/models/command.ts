import Filter from './filter';
import Throttle from './throttle';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class Command {
    @PrimaryGeneratedColumn()
    public ID: number;

    @ManyToOne(() => Filter, {eager: true})
    public roleFilter: Filter;

    @ManyToOne(() => Filter, {eager: true})
    public channelFilter: Filter;

    @ManyToOne(() => Throttle, {eager: true, })
    public throttle: Throttle;

    @Column()
    public action: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
