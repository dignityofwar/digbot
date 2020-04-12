import List from './list';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum FilterType {
    BLACKLIST,
    WHITELIST
}

@Entity()
export default class Filter {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column({type: 'enum', enum: FilterType})
    public type: FilterType;

    @Column()
    public guild: string;

    @Column()
    public name: string;

    @ManyToOne(() => List, {eager: true})
    public list: List;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
