# Configuration
-
Any configuration can be overwritten using a local.json. An example file is included as local.json.example.

## showPerfStats (boolean)
If set to `true` it will console log cpu and memory statistics at a given interval.

## botUserID (string)
The user id of Discord.

#### subBotLimit (integer)
The maximum number of subbots that can be used simultanious. Can be overwritten by the environment variable SUBBOTS\_LIMIT.

## subBots (object)
Object containing objects with the configuration for subbots.
## id (string)(subobject subbot)
The user id of Discord.
## token (string)(config subbot)
Token to connect to the Discord API.

## token (string)
Token to connect to the Discord API. Can be overwritten by the environment variable DISCORD\_API\_TOKEN.

## youtubeKey (string)
Key to connect to the YouTube Data API. Can be overwritten by the environment variable YOUTUBE\_DATA\_API\_KEY.

-

## general (object)
Has the following properties:

## adminsRoleID (string)
Discord role id for the admins.

## devRoleID (string)
Discord role id for the developers.

## forcedPTTRoleID (string)
Discord role id for users where push-to-talk is enforced.

## herebedragonsRoleID (string)
Discord role id for herebedragons channel.

## server (string)
Discord guild/server id of where the bot is assigned to.

## staffRoleID (string)
Discord role id for the staff.

## superMuteRoleID (string)
Discord role id for users which are muted due to mentioning to often.

## leaderRoles (array<string>)
Array of Discord roles ids with leader positions.

## cpuNotificationLimit (integer)
Treshold for when to show a cpu notification in %.

## memoryNotificationLimit (integer)
Treshold for when to show a memory notification in MB.

## port (integer)
Which port should be used by the bot. Can be overwritten by the environment variable DIGBOT\_PORT.

## root (integer)
Root of the project(please do not use this). Can be overwritten by the environment variable DIGBOT\_ROOT.

-

## features (object)
Has the following properties:

## automaticRoleAssignment (boolean)
Assigns roles for games based on the status of an user(done with the communityGames and recreationalGames config)

## channelPositionsEnforcement (boolean)
Enforce the position of channels(done with the channels.positions config). Broken do not use.

## disableCommandSpam (boolean)
If true disables the spam protection of commands.

## disableMentionSpam (boolean)
If true disables the spam protection of mentions.

## modularChannelSystem (boolean)
System to add and remove channels based on their use.

## sfx (boolean)
If !sfx can be used.

## play (boolean)
If !play can be used.

-

## antispamCommandTick (integer)
Interval when to reset the amount of commands allowed in miliseconds.

## antispamCommandLimitCats (integer)
Limit for the !cats command.

## antispamUserTick (integer)
Interval when to reset the amount of messages are allowed by a user in miliseconds.

## antispamUserLimit (integer)
Limit for the amount of messages by a user.

## autoDeleteChannels (integer)
Interval when to check for deletable channels in miliseconds.

## eventProtection (integer)
Time a channel cannot be deleted after an event.

## inactivityLimit (integer)
Minimum number of days before an inactive member is pruned.

## memberMentionLimit (integer)
Limit for the amount of mentions by a user to other users.

## mentionsMuteTime (integer)
Time before a supermute is removed from an user.

## roleMentionsLimit (integer)
Limit for the amount of mentions by a user to roles.

## textInactive (integer)
Threshold for when a channels is considered inactive in miliseconds.

-

## testing (boolean)
Don't use this. Intead use `config.util.getEnv("NODE_ENV") === "testing"`.

## tester (string)
Discord user id for tester(?).

## testerChannel (string)
Discord channel id for tester(?).

-

## channels (object)

## mappings (object)
Maps a key to a Discord channel id(string).

- chitCharVoice
- developers
- digbot
- digBotLog
- events
- general
- herebedragons
- staff
- streams
- ps2dig

## positions.text (object)
Mapping Discord text channels to enforce position.

- id (string): Discord channel id
- name (string): Name given to the channel
- position (integer): Position of the channel

## positions.voice (object)
Mapping Discord voice channels to enforce position.

- id (string): Discord channel id
- name (string): Name given to the channel
- position (integer): Position of the channel

Note: Always define a voice channel with the key "afk".

-

## communityGames (object)
Contains object with the following properties

- name (string): Name of the game
- roleids (array<string>): Array of Discord role ids
- officers (array<string>): Array of Discord role ids
- primaryChannel (string): Discord channel id

## recreationalGames (object)
Contains object with the following properties

- name (string): Name of the game
- roleids (array<string>): Array of Discord role ids
- primaryChannel (string): Discord channel id
