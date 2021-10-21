import {Injectable, Logger} from '@nestjs/common';
import {DiscordEvent} from '../../discord/foundation/decorators/discord-event.decorator';
import {SettingsService} from '../services/settings.service';
import {Client as RestClient} from 'detritus-client-rest';
import {GatewayClientEvents} from 'detritus-client';
import {Member} from 'detritus-client/lib/structures';
import {BaseMessage} from '../entities/base-message.entity';
import {MemberUpdateAccessor} from '../../discord/helpers/member-update.accessor';
import GuildMemberUpdate = GatewayClientEvents.GuildMemberUpdate;
import GuildMemberAdd = GatewayClientEvents.GuildMemberAdd;

@Injectable()
export class MessengerController {
    private static readonly logger = new Logger('MessengerController');

    constructor(
        private readonly settings: SettingsService,
        private readonly rest: RestClient,
        private readonly memberUpdateAccessor: MemberUpdateAccessor,
    ) {
    }

    @DiscordEvent('guildMemberUpdate')
    async role(update: GuildMemberUpdate) {
        const {member} = update;
        if (member.bot) return;

        // TODO: Add ratelimiter

        this.memberUpdateAccessor.addedRoles(update)
            .forEach(async role => {
                const messages = await this.settings.getRoleMessagesByRole(role);

                messages.forEach(message => this.message(member, message));
            });
    }

    @DiscordEvent('guildMemberAdd')
    async join({member}: GuildMemberAdd) {
        if (member.bot) return;

        const messages = await this.settings.getJoinMessagesByGuild(member.guild);

        messages.forEach(message => this.message(member, message));
    }


    @DiscordEvent('guildMemberUpdate')
    async boost(update: GuildMemberUpdate) {
        const {member} = update;

        if (member.bot) return;

        if (this.memberUpdateAccessor.startedBoosting(update)) {
            const messages = await this.settings.getBoostMessagesByGuild(member.guild);

            messages.forEach(message => this.message(member, message));
        }
    }

    private async message(member: Member, {id, channel, message}: BaseMessage): Promise<void> {
        try {
            if (channel.id) {
                await this.rest.createMessage(channel.id, this.formatMessage(message, member));
            } else {
                await member.createMessage({
                    embed: {
                        title: `Message from ${member.guild.name}`,
                        description: this.formatMessage(message, member),
                    },
                });
            }
        } catch (err) {
            MessengerController.logger.warn(`Unable to perform action "${id}" for member "${member.id}": ${err}`);
        }
    }

    private formatMessage(message: string, member: Member): string {
        return message
            .replace(/(?<!\\)\$member/, `<@${member.id}>`)
            .replace(/(?<!\\)\$name/, member.nick ?? member.name);
    }
}
