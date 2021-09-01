import {BaseEntity} from '../../database/base.entity';
import {Index, Property} from '@mikro-orm/core';

export abstract class BaseMessage extends BaseEntity{
    @Property()
    @Index()
    guildId: string;

    @Property()
    channelId?: string;

    @Property({columnType: 'text'})
    message: string;
}