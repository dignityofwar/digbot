import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import MessageActionEmbed from './embeds/messageactionembed';

@Entity()
export default class AntiSpamConfig {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column()
    public guild: string;

    @Column()
    public muteRole: string;

    @Column()
    public everyoneWeight: number;

    @Column()
    public userWeight: number;

    @Column()
    public roleWeight: number;

    @Column()
    public threshold: number;

    @Column(() => MessageActionEmbed)
    public warningMessage: MessageActionEmbed;

    @Column(() => MessageActionEmbed)
    public muteMessage: MessageActionEmbed;

    @Column()
    public decay: number;
}
