import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Role} from '../../discord/entities/role.entity';
import {Emoji} from '../../discord/entities/emoji.entity';
import {Guild} from '../../discord/entities/guild.entity';

@Entity({tableName: 'reaction_roles_on_join'})
export class OnJoinRole {
    @PrimaryKey()
    readonly id: number;

    @Property()
    name: string;

    @Property()
    order: number;

    @ManyToOne()
    guild: Guild;

    @ManyToOne()
    role: Role;

    @Property()
    emojiName: string;

    @ManyToOne()
    emoji?: Emoji;

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
