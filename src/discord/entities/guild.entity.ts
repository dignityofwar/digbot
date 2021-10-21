import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity({tableName: 'discord_guilds'})
export class Guild {
    @PrimaryKey()
    id: string;

    @Property()
    inactiveSince?: Date;
}
