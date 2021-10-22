import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Guild} from '../../discord/entities/guild.entity';
import {DiscordGuild} from '../../discord/decorators/relation.decorators';

@Entity({tableName: 'reaction_roles_on_join_settings'})
export class OnJoinSettings {
    @PrimaryKey()
    readonly id: number;

    @DiscordGuild()
    guild: Guild;

    @Property({columnType: 'text'})
    description: string;

    @Property()
    expireDelay: number; // hours

    @Property()
    delay?: number; // minutes

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
