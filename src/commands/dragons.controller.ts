import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {InjectRepository} from '@nestjs/typeorm';
import {Dragons} from './dragons/dragons.entity';
import {Repository} from 'typeorm';
import {CommandRequest} from './foundation/command.request';
import {MessageEmbed} from 'discord.js';
import {LogService} from '../log/log.service';
import {role} from '../utils/discord.utils';

@Controller()
export class DragonsController {
    constructor(
        @InjectRepository(Dragons)
        private readonly dragonsRepository: Repository<Dragons>,
        private readonly logService: LogService,
    ) {
    }

    @Command({
        command: '!dragons',
        description: 'Get access to the lawless nsfw channels',
    })
    async dragon({member, message, guild}: CommandRequest) {
        const settings = await this.dragonsRepository.findOne({guildId: guild.id});
        if (!settings) return;

        if (member.roles.cache.has(settings.roleId)) {
            await member.roles.add(settings.roleId);
            await message.react('🐉');
        } else {
            await member.roles.remove(settings.roleId);
            return `${member}, you already had the herebedragons role. I've removed it. Type !dragons again to resubscribe.`;
        }
    }

    @Command({
        adminOnly: true,
        command: '!dragons:disable',
        description: 'Disable the dragon command',
    })
    async disable({guild, member}: CommandRequest) {
        await this.dragonsRepository.delete({guildId: guild.id});

        this.logService.log(
            'Dragons Command',
            guild,
            'Disabled the dragons command',
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!dragons:set',
        description: 'Set the dragon role',
    })
    async set({message, channel, guild, member}: CommandRequest) {
        if (!message.mentions.roles.first()) {
            await channel.send(new MessageEmbed().setDescription('Missing dragon role'));
            return;
        }

        const dragon = await this.dragonsRepository.findOne({guildId: guild.id})
            ?? this.dragonsRepository.create({
                guildId: guild.id,
            });

        dragon.roleId = message.mentions.roles.first().id;
        this.dragonsRepository.save(dragon);

        await message.delete();

        this.logService.log(
            'Dragons Command',
            guild,
            `Updated the dragons command role to ${role(dragon.roleId)}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }
}
