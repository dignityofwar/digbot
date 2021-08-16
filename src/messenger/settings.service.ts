import {Injectable} from '@nestjs/common';
import {messenger_boost, messenger_join, messenger_role, PrismaClient} from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    getRoleMessagesByRoles(roleIds: string[]): Promise<messenger_role[]> {
        return this.prisma.messenger_role.findMany({
            where: {
                roleId: {in: roleIds},
            },
        });
    }

    getJoinMessagesByGuild(guildId: string): Promise<messenger_join[]> {
        return this.prisma.messenger_join.findMany({
            where: {
                guildId,
            },
        });
    }

    getBoostMessagesByGuild(guildId: string): Promise<messenger_boost[]> {
        return this.prisma.messenger_boost.findMany({
            where: {
                guildId,
            },
        });
    }
}
