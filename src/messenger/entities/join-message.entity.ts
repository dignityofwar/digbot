import {Entity} from '@mikro-orm/core';
import {BaseMessage} from './base-message.entity';

@Entity({tableName: 'messenger_join'})
export class JoinMessage extends BaseMessage {
}
