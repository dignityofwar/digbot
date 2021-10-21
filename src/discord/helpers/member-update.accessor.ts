import {Role} from 'detritus-client/lib/structures';
import {GatewayClientEvents} from 'detritus-client';
import {Injectable} from '@nestjs/common';
import GuildMemberUpdate = GatewayClientEvents.GuildMemberUpdate;

@Injectable()
export class MemberUpdateAccessor {
    addedRoles(update: GuildMemberUpdate): Role[] {
        const {member, old} = update;

        return member.roles.filter((role, id) => !old.roles.has(id));
    }

    removedRoles(update: GuildMemberUpdate): Role[] {
        const {member, old} = update;

        return old.roles.filter((role, id) => !member.roles.has(id));
    }

    startedBoosting(update: GuildMemberUpdate): boolean {
        const {member, old} = update;

        return member.isBoosting && !old.isBoosting;
    }
}
