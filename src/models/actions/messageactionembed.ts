import { Column } from 'typeorm';

export default class MessageActionEmbed {
    @Column()
    public channel: string;

    @Column()
    public message: string;
}
