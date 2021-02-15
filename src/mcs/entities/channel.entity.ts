import {CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Group} from './group.entity';

@Entity()
export class Channel {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Group, 'channels', {onDelete: 'CASCADE'})
    group: Group;
}
