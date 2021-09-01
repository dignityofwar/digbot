import {Injectable} from '@nestjs/common';
import {EntityManager} from '@mikro-orm/mariadb';
import {RoleHierarchyLink} from './entities/parent-role.entity';

@Injectable()
export class SettingsService {
    private readonly entityManager: EntityManager;

    constructor(
        entityManager: EntityManager,
    ) {
        this.entityManager = entityManager.fork();
    }

    getParentsByRoles(guildId: string, roleIds: string[]): Promise<RoleHierarchyLink[]> {
        return this.entityManager.createQueryBuilder(RoleHierarchyLink)
            .where({guildId, roleId: {$in: roleIds}})
            .groupBy('parentId')
            .getResult();
    }
}