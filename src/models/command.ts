import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Filter from './filter';
import Throttle from './throttle';

@Entity()
export default class Command {
    @PrimaryGeneratedColumn()
    public ID: number;

    @ManyToOne(() => Filter)
    public roleFilter: Filter;

    @ManyToOne(() => Filter)
    public channelFilter: Filter;

    @ManyToOne(() => Throttle)
    public throttle: Throttle;

    @Column()
    public guild: string;

    @Column()
    public name: string;

    @Column({type: 'text'})
    public help: string;

    @Column()
    public action: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
