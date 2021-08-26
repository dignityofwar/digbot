import {Injectable} from '@nestjs/common';
import {PrismaClient, ReactionRole, ReactionRoleJoin, ReactionRoleJoinSettings} from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    getRole(messageId: string, emojiName: string, emojiId?: string): Promise<ReactionRole> {
        return this.prisma.reactionRole.findFirst({
            where: {
                messageId,
                emojiName,
                emojiId,
                expireAt: {gte: new Date()},
            },
        });
    }

    getJoinRoles(guildId: string): Promise<ReactionRoleJoin[]> {
        return this.prisma.reactionRoleJoin.findMany({
            where: {
                guildId,
            },
            orderBy: [{order: 'asc'}],
        });
    }

    getJoinSettings(guildId: string): Promise<ReactionRoleJoinSettings> {
        return this.prisma.reactionRoleJoinSettings.findFirst({
            where: {
                guildId,
            },
        });
    }

    createJoinRole(channelId: string, messageId: string, join: ReactionRoleJoin, expireAt: Date | null) {
        return this.prisma.reactionRoleJoin.update({
            where: {
                id: join.id,
            },
            data: {
                joins: {
                    create: [{
                        reactionRole: {
                            create: {
                                guildId: join.guildId,
                                roleId: join.roleId,
                                channelId,
                                messageId,
                                emojiName: join.emojiName,
                                emojiId: join.emojiId,
                                type: 'DYNAMIC',
                                expireAt,
                            },
                        },
                    }],
                },
            },
        });
    }
}
