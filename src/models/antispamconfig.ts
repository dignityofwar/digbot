import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Guild from './guild';
import Snowflake from './snowflake';
import MessageActionEmbed from './actions/messageactionembed';

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

    @Column(() => MessageActionEmbed)
    public warningMessage?: MessageActionEmbed;

    @Column()
    public thresholdMute: number;

    @Column(() => MessageActionEmbed)
    public muteMessage: MessageActionEmbed;

    @Column()
    public decay: number;
}
