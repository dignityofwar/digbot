import {Entity, ManyToOne, PrimaryKey} from '@mikro-orm/core';
import {Guild} from './guild.entity';

@Entity({tableName: 'discord_roles'})
export class Role {
    @PrimaryKey()
    id: string;

    @ManyToOne({onDelete: 'cascade'})
    guild: Guild;

}
