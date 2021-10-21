import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Guild} from '../../discord/entities/guild.entity';
import {Role} from '../../discord/entities/role.entity';
import {Channel} from '../../discord/entities/channel.entity';
import {Emoji} from '../../discord/entities/emoji.entity';

@Entity({tableName: 'reaction_roles'})
export class ReactionRole {
    @PrimaryKey()
    readonly id: number;

    @ManyToOne()
    guild: Guild;

    @ManyToOne()
    role: Role;

    @ManyToOne()
    channel: Channel;

    @Property()
    messageId: string;

    @Property()
    emojiName: string;

    @ManyToOne()
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
