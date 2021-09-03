import {Entity, Index, Property, Unique} from '@mikro-orm/core';
import {BaseEntity} from '../../database/base.entity';

@Entity({tableName: 'reaction_roles'})
@Unique({properties: ['channelId', 'messageId', 'emojiName', 'emojiId']})
@Index({properties: ['channelId', 'messageId']})
@Index({properties: ['guildId', 'roleId']})
export class ReactionRole extends BaseEntity {
    @Property()
    @Index()
    guildId: string;

    @Property()
    roleId: string;

    @Property()
    channelId: string;

    @Property()
    messageId: string;

    @Property()
    emojiName: string;

    @Property()
    emojiId?: string;

    @Property()
    expireAt?: Date;

    @Property()
    referenceType: string;

    @Property()
    referenceId?: string;
}
