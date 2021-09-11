import {Entity, Property, Unique} from '@mikro-orm/core';
import {BaseEntity} from '../../database/base.entity';

@Entity({tableName: 'reaction_roles_on_join_settings'})
export class OnJoinSettings extends BaseEntity {
    @Property()
    @Unique()
    guildId: string;

    @Property({columnType: 'text'})
    description: string;

    @Property()
    expireDelay: number; // hours

    @Property()
    delay?: number; // minutes
}