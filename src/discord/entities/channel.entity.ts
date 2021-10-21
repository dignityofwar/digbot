import {Entity, ManyToOne, PrimaryKey} from '@mikro-orm/core';
import {Guild} from './guild.entity';

@Entity({tableName: 'discord_channels'})
export class Channel {
    @PrimaryKey()
    id: string;

    @ManyToOne({onDelete: 'cascade'})
    guild?: Guild;
}
