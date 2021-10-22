import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Role} from '../../discord/entities/role.entity';
import {Emoji} from '../../discord/entities/emoji.entity';
import {Guild} from '../../discord/entities/guild.entity';
import {DiscordEmoji, DiscordGuild, DiscordRole} from '../../discord/decorators/relation.decorators';

@Entity({tableName: 'reaction_roles_on_join'})
export class OnJoinRole {
    @PrimaryKey()
    readonly id: number;

    @Property()
    name: string;

    @Property()
    order: number;

    @DiscordGuild()
    guild: Guild;

    @DiscordRole()
    role: Role;

    @Property()
    emojiName: string;

    @DiscordEmoji()
    emoji?: Emoji;

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
