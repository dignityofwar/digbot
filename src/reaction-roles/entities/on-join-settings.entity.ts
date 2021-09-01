import {Entity, Property, Unique} from '@mikro-orm/core';
import {BaseEntity} from '../../database/base.entity';

@Entity({tableName: 'reaction_roles_on_join_settings'})
export class OnJoinSettings extends BaseEntity {
    constructor(data: Omit<OnJoinSettings, 'id' | 'createdAt' | 'updatedAt'>) {
        super();

        Object.assign(this, data);
    }

    @Property()
    @Unique()
    guildId: string;

    @Property({columnType: 'text'})
    description: string;

    @Property()
    expireDelay: number;
}