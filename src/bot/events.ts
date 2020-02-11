import {
    Channel,
    ClientUserGuildSettings,
    ClientUserSettings,
    Collection,
    Emoji,
    Guild,
    GuildMember,
    Message,
    MessageReaction,
    Role,
    Snowflake,
    TextChannel,
    User,
} from 'discord.js';

/**
 * Types for the various event send from Discord
 */
export type onChannelCreate = (channel: Channel) => void;
export type onChannelDelete = (channel: Channel) => void;
export type onChannelPinsUpdate = (channel: Channel, time: Date) => void;
export type onChannelUpdate = (oldChannel: Channel, newChannel: Channel) => void;
export type onClientUserGuildSettingsUpdate = (settings: ClientUserGuildSettings) => void;
export type onClientUserSettingsUpdate = (settings: ClientUserSettings) => void;
export type onDebug = (info: string) => void;
export type onDisconnect = (event: CloseEvent) => void;
export type onEmojiCreate = (emoji: Emoji) => void;
export type onEmojiDelete = (emoji: Emoji) => void;
export type onEmojiUpdate = (oldEmoji: Emoji, newEmoji: Emoji) => void;
export type onError = (error: Error) => void;
export type onGuildBanAdd = (guild: Guild, user: User) => void;
export type onGuildBanRemove = (guild: Guild, user: User) => void;
export type onGuildCreate = (guild: Guild) => void;
export type onGuildDelete = (guild: Guild) => void;
export type onGuildIntegrationsUpdate = (guild: Guild) => void;
export type onGuildMemberAdd = (member: GuildMember) => void;
export type onGuildMemberAvailable = (member: GuildMember) => void;
export type onGuildMemberRemove = (member: GuildMember) => void;
export type onGuildMembersChunk = (members: GuildMember[], guild: Guild) => void;
export type onGuildMemberSpeaking = (member: GuildMember, speaking: boolean) => void;
export type onGuildMemberUpdate = (oldMember: GuildMember, newMember: GuildMember) => void;
export type onGuildUnavailable = (guild: Guild) => void;
export type onGuildUpdate = (oldGuild: Guild, newGuild: Guild) => void;
export type onMessage = (message: Message) => void;
export type onMessageDelete = (message: Message) => void;
export type onMessageDeleteBulk = (messages: Collection<Snowflake, Message>) => void;
export type onMessageReactionAdd = (reaction: MessageReaction, user: User) => void;
export type onMessageReactionRemove = (reaction: MessageReaction, user: User) => void;
export type onMessageReactionRemoveAll = (message: Message) => void;
export type onMessageUpdate = (oldMessage: Message, newMessage: Message) => void;
export type onPresenceUpdate = (oldMessage: Message, newMessage: Message) => void;
export type onRateLimit = (info: object, limit: number, timeDiff: number, path: string, method: string) => void;
export type onReady = () => void;
export type onReconnecting = () => void;
export type onResume = (replayed: number) => void;
export type onRoleCreate = (role: Role) => void;
export type onRoleDelete = (role: Role) => void;
export type onRoleUpdate = (oldRole: Role, newRole: Role) => void;
export type onTypingStart = (channel: Channel, user: User) => void;
export type onTypingStop = (channel: Channel, user: User) => void;
export type onUserNoteUpdate = (user: User, oldNote: string, newNote: string) => void;
export type onUserUpdate = (oldUser: User, newUser: User) => void;
export type onVoiceStateUpdate = (oldMember: GuildMember, newMember: GuildMember) => void;
export type onWarn = (info: string) => void;
export type onWebhookUpdate = (channel: TextChannel) => void;

export type discordEvent = (onChannelCreate | onChannelDelete | onChannelPinsUpdate | onChannelUpdate | onClientUserGuildSettingsUpdate | onClientUserSettingsUpdate | onDebug | onDisconnect | onEmojiCreate | onEmojiDelete | onEmojiUpdate | onError | onGuildBanAdd | onGuildBanRemove | onGuildCreate | onGuildDelete | onGuildIntegrationsUpdate | onGuildMemberAdd | onGuildMemberAvailable | onGuildMemberRemove | onGuildMembersChunk | onGuildMemberSpeaking | onGuildMemberUpdate | onGuildUnavailable | onGuildUpdate | onMessage | onMessageDelete | onMessageDeleteBulk | onMessageReactionAdd | onMessageReactionRemove | onMessageReactionRemoveAll | onMessageUpdate | onPresenceUpdate | onRateLimit | onReady | onReconnecting | onResume | onRoleCreate | onRoleDelete | onRoleUpdate | onTypingStart | onTypingStop | onUserNoteUpdate | onUserUpdate | onVoiceStateUpdate | onWarn | onWebhookUpdate);
