import List from './list';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum FilterType {
    BLACKLIST,
    WHITELIST
}

@Entity()
export default class Filter extends BaseEntity{
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
