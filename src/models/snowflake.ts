import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum SnowflakeType {
    ROLE = 'role',
    CHANNEL = 'channel'
}

@Entity()
export default class Snowflake {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column({type: 'enum', enum: SnowflakeType})
    public type: SnowflakeType;

    @Column()
    public guild: string;

    @Column()
    @Index({unique: true})
    public snowflake: string;
}
