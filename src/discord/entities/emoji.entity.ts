import {Entity, ManyToOne, PrimaryKey} from '@mikro-orm/core';
import {Guild} from './guild.entity';

@Entity({tableName: 'discord_emojis'})
export class Emoji {
    @PrimaryKey()
    id: string;

    @ManyToOne({onDelete: 'cascade'})
    guild: Guild;
}
