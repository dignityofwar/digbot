import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Guild from './guild';
import Snowflake from './snowflake';

@Entity()
export default class AntiSpamConfig {
    @PrimaryGeneratedColumn()
    public ID: number;

    @ManyToOne(() => Guild)
    public guild: Guild;

    @ManyToOne(() => Snowflake)
    public muteRole: Snowflake;

    @Column()
    public everyoneWeight: number;

    @Column()
    public userWeight: number;

    @Column()
    public roleWeight: number;

    @Column()
    public thresholdWarning?: number;

    @Column({type: 'text'})
    public warningMessage?: string;

    @Column({type: 'text'})
    public warningDM?: string;

    @Column()
    public thresholdMute: number;

    @Column()
    public decay: number;
}
