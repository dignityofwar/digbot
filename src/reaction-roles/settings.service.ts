import {Injectable} from '@nestjs/common';
import {PrismaClient, rr_role} from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    getRole(messageId: string, emoji: string): Promise<rr_role> {
        return this.prisma.rr_role.findFirst({
            where: {
                messageId,
                emoji,
            },
        });
    }
}
