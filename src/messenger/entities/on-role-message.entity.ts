import {Entity, Index, Property, Unique} from '@mikro-orm/core';
import {BaseMessage} from './base-message.entity';

@Entity({tableName: 'messenger_role'})
@Unique({properties: ['guildId', 'roleId', 'channelId']})
@Index({properties: ['guildId', 'roleId']})
export class OnRoleMessage extends BaseMessage {
    constructor(data: Omit<OnRoleMessage, 'id' | 'createdAt' | 'updatedAt'>) {
        super();

        Object.assign(this, data);
    }

    @Property()
    roleId: string;
}
