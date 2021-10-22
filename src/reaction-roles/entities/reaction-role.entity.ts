import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Guild} from '../../discord/entities/guild.entity';
import {Role} from '../../discord/entities/role.entity';
import {Channel} from '../../discord/entities/channel.entity';
import {Emoji} from '../../discord/entities/emoji.entity';
import {DiscordChannel, DiscordEmoji, DiscordGuild, DiscordRole} from '../../discord/decorators/relation.decorators';

@Entity({tableName: 'reaction_roles'})
export class ReactionRole {
    @PrimaryKey()
    readonly id: number;

    @DiscordGuild()
    guild: Guild;

    @DiscordRole()
    role: Role;

    @DiscordChannel()
    channel: Channel;

    @Property()
    messageId: string;

    @Property()
    emojiName: string;

    @DiscordEmoji()
    emoji?: Emoji;

    @Property()
    expireAt?: Date;

    @Property()
    referenceType: string;

    @Property()
    referenceId?: string;

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
