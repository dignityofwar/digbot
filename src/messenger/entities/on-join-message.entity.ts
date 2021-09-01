import {Entity, Unique} from '@mikro-orm/core';
import {BaseMessage} from './base-message.entity';

@Entity({tableName: 'messenger_join'})
@Unique({properties: ['guildId', 'channelId']})
export class OnJoinMessage extends BaseMessage {
    constructor(data: Omit<OnJoinMessage, 'id' | 'createdAt' | 'updatedAt'>) {
        super();

        Object.assign(this, data);
    }
}
