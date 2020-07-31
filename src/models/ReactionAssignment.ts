import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class ReactionAssignment {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column()
    public guild: string;

    @Column()
    public message: string;

    @Column()
    public emoji: string;

    @Column()
    public role: string;
}
