If you need help ask in the dev channel in the DIG discord. Please note this readme requires updating and information may be outdated.

<div align="center">
    <h1>DIGBot</h1>
    <h4>DIG community's custom discord bot</h4>
</div>

## About

DIGBot is a custom discord bot ran on the [DIG community's discord server](https://discord.gg/cjQBNpc), it was originally created to fulfil all the functionality of the current bots that were on the server and allow the community to implement any feature's they desired.

### Tech

Language: Node.js  
Deployment: Docker  
Discord API handler: discord.js  

## Features

### Command List
#### !Admin
Send user a list of admin commands if they have access to them

#### !Catfacts
Posts a random cat fact

#### !Cats
Replies with a picture or gif of a cat depending on the request

#### !dragons
Adds a discord role to the requester giving them access to an otherwise hidden channel

#### !lmgtfy
(Let me google that for you), replies with a somewhat comical google search link

#### !mentions
Allows a user to check the number of mentions they are allowed to use

#### !ping
Used to check the bot's responsiveness, replies with user message to bot reply ping time

#### !play
Used to stream audio into voice channels from youtube videos

#### !poll
Holds short surveys which users can vote in

#### !positions
Sends admin a list of all channels on the server and their associated position variables

#### !ps2digfeedback
Replies with a link where users can give feedback to leaders in planetside

#### !restart
Manually restarts the bot

#### !roles
Send admin a list of all roles on the server and their associated IDs

#### !sfx
Plays sounds effects in voice channels

#### !started
Show the user the time period for which the bot has been continuously running

#### !stats
Posts bot statistics

#### !vote
Used to vote in !poll surveys

### Admin functionality

#### Anti Spam
DIGBot has anti spam admin mechanics. It is capable of recognising and taking steps to prevent spam in several situations, such as:
- When users attempt to spam command requests to the bot
- If a user attempts to use commands outside of designated channels
- When users make use of mentions to liberally, especially when they are sending notifications to group tags and not individuals
- When a user is posting links to a twitch stream outside of a designated channel

### Automated functions

#### Channel auto-delete
DIGBot is capable of creating temporary voice or text channels for users. The bot frequently checks these channels to make sure they're still in use and deletes them when they're no longer required

#### Channel position enforcement
A frequent problem on servers where many people have permissions to move channels is users will often accidentally move the order of channels they are attempting to join into. DIGBot reacts when this happens to enforce the correct ordering of channels

#### Events
DIGBot is capable of reacting when events are scheduled to remind people of their occurrence

#### Modular Channel System (MCS)
Some channels the community would prefer to always have a free version of. This is the case for channels such as dedicated voice channels for certain games, for example if a member joins a voice channel for a game such as planetside DIGBot will react by creating a second voice channel for that game so there is still a free channel. Every-time a modular channel become populated or empty, DIGBot will respond by creating or deleting a channel as needed


## Development

### Contributing

See the [contribution guidelines](CONTRIBUTING.md) file for information on how to contribute to the project and setting up your local development version of the project.

### Code Usage

The project is in the process of being open sourced however as of this moment no usage licence is provided.

### Acknowledgements

This repository was created from an [existing private codebase](https://github.com/JamesLongman/DIGBot/releases/tag/0.0.1) for DIGBot which can be found. The previous project was headed by Maelstromeous who was ultimately responsible for code review, design decisions and deployment.

File contributions were as follows  
Maelstromeous: 510 commits,  7,623 additions, 6,378 deletions  
JamesLongman: 459 commits, 30,076 additions, 18,144 deletions  
Euwas: 37 commits, 1,982 additions, 1040 deletions  
CptCannonFodder: 10 commits, 22 additions, 16 deletions  
Blacky704: 3 commits, 29 additions, 8 deletions  
