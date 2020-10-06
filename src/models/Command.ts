import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Filter from './Filter';
import Throttle from './Throttle';

@Entity()
export default class Command {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column()
    public guild: string;

    @ManyToOne(() => Filter)
    public roleFilter: Filter;

    @ManyToOne(() => Filter)
    public channelFilter: Filter;

    @ManyToOne(() => Throttle)
    public throttle: Throttle;

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
