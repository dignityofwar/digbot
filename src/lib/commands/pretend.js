const config = require('config');
const { RichEmbed } = require('discord.js');
const Command = require('./foundation/command');

module.exports = class PretendCommand extends Command {
    constructor() {
        super();

        this.name = 'pretend';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (!config.has(`guilds.${request.guild.id}.autoRoleAssignment`)
            || config.get(`guilds.${request.guild.id}.autoRoleAssignment`).length === 0) {
            return request.respond('This server doesn\'t use automatic role assignment.');
        }

        const name = this.getArgument(request);

        if (name.startsWith('list')) {
            return request.respond(this.listMessage(request.guild));
        }

        const roles = this.getRoles(request.guild, name);

        if (!roles) {
            return request.respond(`Couldn't find any roles associated with "${name}", try !pretend list.`);
        }

        const log = `User self assigned these roles, using ${name}`;

        roles instanceof Array ? await request.member.addRoles(roles, log) : await request.member.addRole(roles, log);

        return request.respond('The roles are assigned.');
    }

    /**
     *
     * @param content
     * @return {string}
     */
    getArgument({ content }) {
        return (/^[^\s]+\s+(.*)\s*$/).exec(content)[1];
    }

    /**
     * @param guild
     * @param name
     * @return {undefined|*}
     */
    getRoles(guild, name) {
        if (config.has(`guilds.${guild.id}.autoRoleAssignment`)) {
            const key = Object.keys(config.get(`guilds.${guild.id}.autoRoleAssignment`))
                .find(k => name.toUpperCase().includes(k.toUpperCase()));

            if (key) {
                return config.get(`guilds.${guild.id}.autoRoleAssignment.${key}`);
            }
        }

        return undefined;
    }

    /**
     *
     * @param guild
     * @return {{embed: {title: string, fields: ...*[]}}}
     */
    listMessage(guild) {
        return new RichEmbed().setDescription(
            Object.keys(config.get(`guilds.${guild.id}.autoRoleAssignment`)).join('\n'),
        );
    }

    /**
     * @return {string}
     */
    help() {
        return 'With this command you can pretend to play some game and get those sweet sweet roles. Use !pretend '
            + 'list to see what is available.';
    }
};
