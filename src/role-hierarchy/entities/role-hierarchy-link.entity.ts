import {Entity, Index, Property, Unique} from '@mikro-orm/core';
import {BaseEntity} from '../../database/base.entity';

@Entity()
@Unique({properties: ['guildId', 'roleId']})
@Index({properties: ['guildId', 'parentId']})
export class RoleHierarchyLink extends BaseEntity {
    @Property()
    @Index()
    guildId: string;

    @Property()
    roleId: string;

    @Property()
    parentId: string;
}
