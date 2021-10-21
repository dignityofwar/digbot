import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {EntityManager} from '@mikro-orm/mariadb';
import {RoleHierarchyLink} from '../entities/role-hierarchy-link.entity';
import {Guild, Role} from 'detritus-client/lib/structures';

@Injectable()
export class SettingsService {
    private readonly entityManager: EntityManager;

    constructor(
        entityManager: EntityManager,
    ) {
        this.entityManager = entityManager.fork();
    }

    getLinksByGuild(guild: Guild): Promise<RoleHierarchyLink[]> {
        return this.entityManager.find(RoleHierarchyLink, {guild: guild.id});
    }

    getParentsByRole(role: Role): Promise<RoleHierarchyLink> {
        return this.entityManager.findOne(RoleHierarchyLink, {guild: role.guildId, role: role.id});
    }

    async createLink(role: Role, parent: Role): Promise<RoleHierarchyLink> {
        if (role.guildId != parent.guildId)
            throw new UnprocessableEntityException('Roles belong to different guilds');

        const {guildId, id: roleId} = role;
        const {id: parentId} = parent;

        const link = this.entityManager.create(RoleHierarchyLink, {guildId, roleId, parentId});
        await this.entityManager.persistAndFlush(link);

        return link;
    }

    async deleteLink(role: Role, parent: Role): Promise<void> {
        if (role.guildId != parent.guildId)
            throw new UnprocessableEntityException('Roles belong to different guilds');

        const link = await this.entityManager.findOneOrFail(RoleHierarchyLink, {
            guild: role.guildId,
            role: role.id,
            parent: parent.id,
        });

        await this.entityManager.removeAndFlush(link);
    }
}
