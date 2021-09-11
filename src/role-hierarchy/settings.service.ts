import {Injectable} from '@nestjs/common';
import {EntityManager} from '@mikro-orm/mariadb';
import {RoleHierarchyLink} from './entities/role-hierarchy-link.entity';

@Injectable()
export class SettingsService {
    private readonly entityManager: EntityManager;

    constructor(
        entityManager: EntityManager,
    ) {
        this.entityManager = entityManager.fork();
    }

    getLinksByGuild(guildId: string): Promise<RoleHierarchyLink[]> {
        return this.entityManager.find(RoleHierarchyLink, {guildId});
    }

    getParentsByRole(guildId: string, roleId: string): Promise<RoleHierarchyLink> {
        return this.entityManager.findOne(RoleHierarchyLink, {guildId, roleId});
    }

    async createLink(guildId: string, roleId: string, parentId: string): Promise<RoleHierarchyLink> {
        const link = this.entityManager.create(RoleHierarchyLink, {guildId, roleId, parentId});
        await this.entityManager.persistAndFlush(link);

        return link;
    }

    async deleteLink(guildId: string, roleId: string, parentId: string): Promise<void> {
        const link = await this.entityManager.findOneOrFail(RoleHierarchyLink, {guildId, roleId, parentId});

        await this.entityManager.removeAndFlush(link);
    }
}