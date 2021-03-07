import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('commands_dragons')
export class Dragons {
    @PrimaryGeneratedColumn()
    readonly id;

    @Column({unique: true})
    guildId: string;

    @Column()
    @Index()
    roleId: string;
}