import {Entity} from '@mikro-orm/core';
import {BaseMessage} from './base-message.entity';
import {Role} from '../../discord/entities/role.entity';
import {DiscordRole} from '../../discord/decorators/relation.decorators';

@Entity({tableName: 'messenger_role'})
export class RoleMessage extends BaseMessage {
    @DiscordRole()
    role: Role;
}
