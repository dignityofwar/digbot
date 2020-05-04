import { Column, PrimaryGeneratedColumn } from 'typeorm';

export default class Guild {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column()
    public guildID: string;

    @Column()
    public name: string;
}
