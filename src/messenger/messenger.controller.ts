import {Controller, Logger} from '@nestjs/common';
import {On} from '../discord/decorators/on.decorator';
import {SettingsService} from './settings.service';
import {Client as RestClient} from 'detritus-client-rest';
import {GatewayClientEvents} from 'detritus-client';
import {Member} from 'detritus-client/lib/structures';
import {OnRoleMessage} from './entities/on-role-message.entity';
import {OnJoinMessage} from './entities/on-join-message.entity';
import {OnBoostMessage} from './entities/on-boost-message.entity';
import GuildMemberUpdate = GatewayClientEvents.GuildMemberUpdate;
import GuildMemberAdd = GatewayClientEvents.GuildMemberAdd;

@Controller()
export class MessengerController {
    private static readonly logger = new Logger('MessengerController');

    constructor(
        private readonly settings: SettingsService,
        private readonly rest: RestClient,
    ) {
    }

    @On('guildMemberUpdate')
    async role({member, old}: GuildMemberUpdate) {
        if (member.bot) return;

        // TODO: Add ratelimiter

        const messages = await this.settings.getRoleMessagesByRoles(
            Array.from(member.roles.keys())
                .filter(role => !old.roles.has(role)),
        );

        messages.forEach(message => this.message(member, message));
    }

    @On('guildMemberAdd')
    async join({member}: GuildMemberAdd) {
        if (member.bot) return;

        const messages = await this.settings.getJoinMessagesByGuild(member.guild.id);

        messages.forEach(message => this.message(member, message));
    }


    @On('guildMemberUpdate')
    async boost({member, old}: GuildMemberUpdate) {
        if (member.bot) return;

        if (member.isBoosting && !old.isBoosting) {
            const messages = await this.settings.getBoostMessagesByGuild(member.guild.id);

            messages.forEach(message => this.message(member, message));
        }
    }

    private async message(member: Member, {
        id,
        channelId,
        message,
    }: OnRoleMessage | OnJoinMessage | OnBoostMessage): Promise<void> {
        try {
            if (channelId) {
                await this.rest.createMessage(channelId, this.formatMessage(message, member));
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
