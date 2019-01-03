const config = require('config');
const { asClass, asFunction } = require('awilix');
const { Client } = require('discord.js');
const ServiceProvider = require('../core/serviceprovider');

const DiscordTransport = require('../logger/discordtransport');

const crashHandler = require('../crash-handling');
const serverEvents = require('../discord/bot-events');
const server = require('../server/server');

module.exports = class DiscordProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('discordjsClient', asFunction(({ logger }) => {
            const client = new Client();

            // client.on('error', () => logger.debug('The Discord Client encountered an error.'));

            client.on('debug', (info) => {
                logger.log('debug', {
                    message: info,
                    label: 'discordjsClient',
                });
                // throw new Error('Hello World');
            });

            // TODO: All listeners here should only log.

            // Emitted when the client client is ready
            client.on('ready', () => {
                crashHandler.logEvent('discordbot', 'ready');
                serverEvents.ready(client);
            });

            client.on('reconnecting', () => {
                // Log level is warn so it will be logged to discord
                logger.log('warn', {
                    message: 'Client disconnected, attempting reconnection...',
                    label: 'discordjsClient',
                });

                if (server.getBooted()) {
                    server.wipeGuild(config.get('general.server'));
                }
            });

            client.on('disconnect', (event) => {
                // Log level is warn so it will be logged to discord
                // TODO: Log level should depend on event.code
                logger.log('warn', {
                    message: `Disconnected(code ${event.code}): ${event.reason}`,
                    label: 'discordjsClient',
                });

                server.wipeGuild(config.get('general.server'));
                server.markAsNotReady();
            });

            client.on('warn', (warning) => {
                logger.log('warn', {
                    message: warning,
                    label: 'discordjsClient',
                });
            });


            // When a channel is created
            client.on('channelCreate', (channel) => {
                crashHandler.logEvent('discordbot', 'channelCreate');
                serverEvents.channelCreate(channel, client);
            });

            // Emitted whenever a channel is deleted
            client.on('channelDelete', (channel) => {
                crashHandler.logEvent('discordbot', 'channelDelete');
                serverEvents.channelDelete(channel, client);
            });

            // Emitted whenever a channel is updated, Ex: Description, name
            client.on('channelUpdate', (oldChannel, newChannel) => {
                crashHandler.logEvent('discordbot', 'channelUpdate');
                serverEvents.channelUpdate(oldChannel, newChannel, client);
            });

            // Emitted whenever the client joins a guild.
            client.on('guildCreate', (guild) => {
                crashHandler.logEvent('discordbot', 'guildCreate');
                serverEvents.guildCreate(guild, client);
            });

            // Emitted whenever a client leaves a guild or a guild is deleted.
            client.on('guildDelete', (guild) => {
                crashHandler.logEvent('discordbot', 'guildDelete');
                serverEvents.guildDelete(guild);
            });

            // Send welcome message DM to new arrivals
            client.on('guildMemberAdd', (mem) => {
                crashHandler.logEvent('discordbot', 'guildMemberAdd');
                serverEvents.guildMemberAdd(mem, client);
            });

            // Emitted whenever a member leaves a guild
            client.on('guildMemberRemove', (member) => {
                crashHandler.logEvent('discordbot', 'guildMemberRemove');
                serverEvents.guildMemberRemove(member, client);
            });

            // Emitted whenever a Guild Member changes - i.e. new role, removed role, nickname
            client.on('guildMemberUpdate', (oldMember, newMember) => {
                crashHandler.logEvent('discordbot', 'guildMemberUpdate');
                serverEvents.guildMemberUpdate(oldMember, newMember);
            });

            // Emitted whenever a member leaves a guild
            client.on('guildUpdate', (oldGuild, newGuild) => {
                crashHandler.logEvent('discordbot', 'guildUpdate');
                serverEvents.guildUpdate(oldGuild, newGuild, client);
            });

            // Whenever the client recieves a message from the websocket
            client.on('message', (msg) => {
                crashHandler.logEvent('discordbot', 'message');
                serverEvents.message(msg, client);
            });

            // Whenever a message that the client can see is updated (edits, embeds, etc.)
            client.on('messageUpdate', (oldMessage, newMessage) => {
                crashHandler.logEvent('discordbot', 'messageUpdate');
                serverEvents.messageUpdate(oldMessage, newMessage);
            });

            // When a user starts playing a game, check if they have the relevent roles
            client.on('presenceUpdate', (oldMember, newMember) => {
                crashHandler.logEvent('discordbot', 'presenceUpdate');
                serverEvents.presenceUpdate(oldMember, newMember);
            });

            // On the creation of a role
            client.on('roleCreate', (role) => {
                crashHandler.logEvent('discordbot', 'roleCreate');
                serverEvents.roleCreate(role, client);
            });

            // On the deletion of a role
            client.on('roleDelete', (role) => {
                crashHandler.logEvent('discordbot', 'roleDelete');
                serverEvents.roleDelete(role, client);
            });

            // On the update of a role, i.e. perms, ordering etc.
            client.on('roleUpdate', (oldRole, newRole) => {
                crashHandler.logEvent('discordbot', 'roleUpdate');
                serverEvents.roleUpdate(oldRole, newRole, client);
            });

            // Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
            client.on('voiceStateUpdate', (oldMember, newMember) => {
                crashHandler.logEvent('discordbot', 'voiceStateUpdate');
                serverEvents.voiceStateUpdate(oldMember, newMember);
            });

            return client;
        })
            .singleton() // TODO: remove singleton to allow new instances to be created on disconnect
            .disposer(client => client.destroy()));

        // TODO: Should ignore all verbose or lower discordjsClient logs. Logging should be separated from the client.
        this.container.register('loggerDiscordTransport', asClass(DiscordTransport)
            .inject(() => ({ opts: { level: 'warn' } })));
    }

    /**
     * Boots any dependency
     *
     * @return {Promise<void>}
     */
    async boot() {
        await this.container.resolve('discordjsClient')
            .login(config.get('token'));

        this.container.resolve('logger')
            .add(this.container.resolve('loggerDiscordTransport'));
    }
};
