import {Entity, ManyToOne, PrimaryKey} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Guild} from '../../discord/entities/guild.entity';
import {Role} from '../../discord/entities/role.entity';

@Entity()
export class RoleHierarchyLink {
    @PrimaryKey()
    readonly id: number;

    @ManyToOne()
    guild: Guild;

    @ManyToOne()
    role: Role;

    @ManyToOne()
    parent: Role;

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
