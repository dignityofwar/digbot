import {Injectable} from '@nestjs/common';
import {EntityManager} from '@mikro-orm/mariadb';
import {RoleMessage} from '../entities/role-message.entity';
import {JoinMessage} from '../entities/join-message.entity';
import {BoostMessage} from '../entities/boost-message.entity';
import {Guild, Role} from 'detritus-client/lib/structures';

@Injectable()
export class SettingsService {
    private readonly entityManager: EntityManager;

    constructor(
        entityManager: EntityManager,
    ) {
        this.entityManager = entityManager.fork();
    }

    async getRoleMessagesByRole(role: Role): Promise<RoleMessage[]> {
        const {guildId, id: roleId} = role;

        return this.entityManager.find(RoleMessage, {guild: guildId, role: roleId});
    }

    getJoinMessagesByGuild(guild: Guild): Promise<JoinMessage[]> {
        const {id: guildId} = guild;

        return this.entityManager.find(JoinMessage, {guild: guildId});
    }

    getBoostMessagesByGuild(guild: Guild): Promise<BoostMessage[]> {
        const {id: guildId} = guild;

        return this.entityManager.find(BoostMessage, {guild: guildId});
    }
}
