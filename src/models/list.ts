import Snowflake, { SnowflakeType } from './snowflake';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class List extends BaseEntity{
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column({type: 'enum', enum: SnowflakeType})
    public type: SnowflakeType;

    @Column()
    public guild: string;

    @Column()
    public name: string;

    @ManyToMany(() => Snowflake, {eager: true})
    public snowflakes: Snowflake[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
