import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class TemporaryAssignedRole {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column()
    public guild: string;

    @Column()
    public member: string;

    @Column()
    public role: string;

    @Column()
    public removeAt: Date;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
