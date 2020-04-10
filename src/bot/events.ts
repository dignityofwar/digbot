import {
    Channel,
    Collection,
    DMChannel,
    Guild,
    GuildChannel,
    Emoji,
    GuildMember,
    Message,
    MessageReaction,
    Presence,
    Role,
    Snowflake,
    Speaking,
    TextChannel,
    User,
    VoiceState,
} from 'discord.js';
import { CloseEvent } from 'ws';

/**
 * Types for the various event send from Discord
 *
 */
export type onChannelCreate = (channel: DMChannel | GuildChannel) => void;
export type onChannelDelete = (channel: DMChannel | GuildChannel) => void;
export type onChannelPinsUpdate = (channel: DMChannel | GuildChannel, time: Date) => void;
export type onChannelUpdate = (oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) => void;
export type onDebug = (info: string) => void;
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
export type onGuildMemberRemove = (member: GuildMember) => void;
export type onGuildMembersChunk = (members: Collection<Snowflake, GuildMember>, guild: Guild) => void;
export type onGuildMemberSpeaking = (member: GuildMember, speaking: Readonly<Speaking>) => void;
export type onGuildMemberUpdate = (oldMember: GuildMember, newMember: GuildMember) => void;
export type onGuildUnavailable = (guild: Guild) => void;
export type onGuildUpdate = (oldGuild: Guild, newGuild: Guild) => void;
export type onInvalidated = () => void;
export type onMessage = (message: Message) => void;
export type onMessageDelete = (message: Message) => void;
export type onMessageDeleteBulk = (messages: Collection<Snowflake, Message>) => void;
export type onMessageReactionAdd = (reaction: MessageReaction, user: User) => void;
export type onMessageReactionRemove = (reaction: MessageReaction, user: User) => void;
export type onMessageReactionRemoveAll = (message: Message) => void;
export type onMessageReactionRemoveEmoji = (reaction: MessageReaction) => void;
export type onMessageUpdate = (oldMessage: Message, newMessage: Message) => void;
export type onPresenceUpdate = (oldPresence: Presence | null, newPresence: Presence) => void;
export type onRateLimit = (info: { timeout: number; limit: number; method: string; path: string; route: string }) => void;
export type onReady = () => void;
export type onRoleCreate = (role: Role) => void;
export type onRoleDelete = (role: Role) => void;
export type onRoleUpdate = (oldRole: Role, newRole: Role) => void;
export type onShardDisconnect = (event: CloseEvent, id: number) => void;
export type onShardError = (error: Error, id: number) => void;
export type onShardReady = (id: number, unavailableGuilds?: Set<string>) => void;
export type onShardReconnecting = (id: number) => void;
export type onShardResume = (id: number, replayedEvents: number) => void;
export type onTypingStart = (channel: Channel, user: User) => void;
export type onTypingStop = (channel: Channel, user: User) => void;
export type onUserUpdate = (oldUser: User, newUser: User) => void;
export type onVoiceStateUpdate = (oldState: VoiceState, newState: VoiceState) => void;
export type onWarn = (info: string) => void;
export type onWebhookUpdate = (channel: TextChannel) => void;

export type discordEvent = onChannelCreate
    | onChannelDelete
    | onChannelPinsUpdate
    | onChannelUpdate
    | onDebug
    | onEmojiCreate
    | onEmojiDelete
    | onEmojiUpdate
    | onError
    | onGuildBanAdd
    | onGuildBanRemove
    | onGuildCreate
    | onGuildDelete
    | onGuildIntegrationsUpdate
    | onGuildMemberAdd
    | onGuildMemberRemove
    | onGuildMembersChunk
    | onGuildMemberSpeaking
    | onGuildMemberUpdate
    | onGuildUnavailable
    | onGuildUpdate
    | onInvalidated
    | onMessage
    | onMessageDelete
    | onMessageDeleteBulk
    | onMessageReactionAdd
    | onMessageReactionRemove
    | onMessageReactionRemoveAll
    | onMessageReactionRemoveEmoji
    | onMessageUpdate
    | onPresenceUpdate
    | onRateLimit
    | onReady
    | onRoleCreate
    | onRoleDelete
    | onRoleUpdate
    | onShardDisconnect
    | onShardError
    | onShardReady
    | onShardReconnecting
    | onShardResume
    | onTypingStart
    | onTypingStop
    | onUserUpdate
    | onVoiceStateUpdate
    | onWarn
    | onWebhookUpdate;
