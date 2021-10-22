import {Entity, PrimaryKey} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Guild} from '../../discord/entities/guild.entity';
import {Role} from '../../discord/entities/role.entity';
import {DiscordChannel, DiscordRole} from '../../discord/decorators/relation.decorators';

@Entity()
export class RoleHierarchyLink {
    @PrimaryKey()
    readonly id: number;

    @DiscordChannel()
    guild: Guild;

    @DiscordRole()
    role: Role;

    @DiscordRole()
    parent: Role;

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
