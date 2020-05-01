import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ThrottleType {
    GUILD = 'guild',
    CHANNEL = 'channel',
    MEMBER = 'member'
}

@Entity()
export default class Throttle extends BaseEntity {
    @PrimaryGeneratedColumn()
    public ID: number;

    @Column({type: 'simple-enum', enum: ThrottleType})
    public type: ThrottleType;

    @Column()
    public guild: string;

    @Column()
    public name: string;

    @Column()
    public max: number;

    @Column()
    public decay: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
