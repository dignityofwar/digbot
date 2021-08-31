import {Injectable} from '@nestjs/common';
import {EntityManager} from '@mikro-orm/mariadb';
import {OnRoleMessage} from './entities/on-role-message.entity';
import {OnJoinMessage} from './entities/on-join-message.entity';
import {OnBoostMessage} from './entities/on-boost-message.entity';

@Injectable()
export class SettingsService {
    private readonly entityManager: EntityManager;

    constructor(
        entityManager: EntityManager,
    ) {
        this.entityManager = entityManager.fork();
    }

    getRoleMessagesByRoles(roleIds: string[]): Promise<OnRoleMessage[]> {
        return this.entityManager.find(OnRoleMessage, {roleId: {$in: roleIds}});
    }

    getJoinMessagesByGuild(guildId: string): Promise<OnJoinMessage[]> {
        return this.entityManager.find(OnJoinMessage, {guildId});

    }

    getBoostMessagesByGuild(guildId: string): Promise<OnBoostMessage[]> {
        return this.entityManager.find(OnBoostMessage, {guildId});
    }
}
