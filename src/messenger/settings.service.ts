import {Injectable} from '@nestjs/common';
import {MessengerBoost, MessengerJoin, MessengerRole, PrismaClient} from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    getRoleMessagesByRoles(roleIds: string[]): Promise<MessengerRole[]> {
        return this.prisma.messengerRole.findMany({
            where: {
                roleId: {in: roleIds},
            },
        });
    }

    getJoinMessagesByGuild(guildId: string): Promise<MessengerJoin[]> {
        return this.prisma.messengerJoin.findMany({
            where: {
                guildId,
            },
        });
    }

    getBoostMessagesByGuild(guildId: string): Promise<MessengerBoost[]> {
        return this.prisma.messengerBoost.findMany({
            where: {
                guildId,
            },
        });
    }
}
