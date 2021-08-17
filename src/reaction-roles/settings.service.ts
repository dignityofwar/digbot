import {Injectable} from '@nestjs/common';
import {PrismaClient, ReactionRole} from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    getRole(messageId: string, emoji: string): Promise<ReactionRole> {
        return this.prisma.reactionRole.findFirst({
            where: {
                messageId,
                emoji,
            },
        });
    }
}
