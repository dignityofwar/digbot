import {Entity, ManyToOne} from '@mikro-orm/core';
import {BaseMessage} from './base-message.entity';
import {Role} from '../../discord/entities/role.entity';

@Entity({tableName: 'messenger_role'})
export class RoleMessage extends BaseMessage {
    @ManyToOne()
    role: Role;
}
