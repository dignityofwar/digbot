import {Entity} from '@mikro-orm/core';
import {BaseMessage} from './base-message.entity';

@Entity({tableName: 'messenger_boost'})
export class BoostMessage extends BaseMessage {
}
