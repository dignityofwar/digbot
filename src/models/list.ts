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
export default class List extends BaseEntity {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column({type: 'simple-enum', enum: SnowflakeType})
    public type: SnowflakeType;

    @Column()
    public guild: string;

    @Column()
    public name: string;

    @ManyToMany(() => Snowflake)
    public snowflakes: Snowflake[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
