import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Snowflake {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column()
    public guild: string;

    @Column()
    public member: string;

    @Column()
    public lastWarning?: Date;

    @Column()
    public currentMute?: Date;

    @Column()
    public warnings: number;

    @Column()
    public offenses: number;
}
