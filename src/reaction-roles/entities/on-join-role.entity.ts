import {Entity, Index, Property, Unique} from '@mikro-orm/core';
import {BaseEntity} from '../../database/base.entity';

@Entity({tableName: 'reaction_roles_on_join'})
@Unique({properties: ['guildId', 'emojiName', 'emojiId']})
@Index({properties: ['guildId', 'roleId']})
export class OnJoinRole extends BaseEntity {
    constructor(data: Omit<OnJoinRole, 'id' | 'createdAt' | 'updatedAt'>) {
        super();

        Object.assign(this, data);
    }

    @Property()
    @Index()
    guildId: string;

    @Property()
    roleId: string;

    @Property()
    emojiName: string;

    @Property()
    emojiId?: string;

    @Property()
    isAnimated: boolean;

    @Property()
    name: string;

    @Property()
    order: number;
}
