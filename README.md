# DIGBot

[![Travis CI Badge](https://travis-ci.org/dignityofwar/DIGBot.svg?branch=master)](https://travis-ci.org/dignityofwar/DIGBot)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bfed4f3b6b4a47639200d5a26c319d75)](https://www.codacy.com/app/dignityofwar/DIGBot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dignityofwar/DIGBot&amp;utm_campaign=Badge_Grade)

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

#### Auto role assignment
DIGBot detects when people are playing certain games, if this is a game that the community plays DIGBot will automatically give the user the role to see that game's voice and text channels.

#### Channel auto-delete
DIGBot is capable of creating temporary voice or text channels for users. The bot frequently checks these channels to make sure they're still in use and deletes them when they're no longer required

#### Channel position enforcement
A frequent problem on servers where many people have permissions to move channels is users will often accidentally move the order of channels they are attempting to join into. DIGBot reacts when this happens to enforce the correct ordering of channels

#### Events
DIGBot is capable of reacting when events are scheduled to remind people of their occurrence

#### Modular Channel System (MCS)
Some channels the community would prefer to always have a free version of. This is the case for channels such as dedicated voice channels for certain games, for example if a member joins a voice channel for a game such as planetside DIGBot will react by creating a second voice channel for that game so there is still a free channel. Every-time a modular channel become populated or empty, DIGBot will respond by creating or deleting a channel as needed

## Usage

### Requirements

The bot uses docker 1.13.0+. Installation instructions can be found here: <https://docs.docker.com/install/>

### Deployment via Docker Hub

Docker Hub automatically builds and stores docker images of staging and master (our production branch). We deploy the bot using the latest docker images from Docker Hub using `docker pull dignityofwar/digbot`.

### From the repository

To run the bot locally use `npm run up`, and to stop the container and remove it use `npm run down`. The local.json config file will be automatically linked to the container.

To run the tests you use `npm test` (this will also link the local.json config file). 

It is of course possible to run it without docker, but this is not recommended.

## Development

### Contributing

See the [contribution guidelines](CONTRIBUTING.md) file for information on how to contribute to the project and setting up your local development version of the project.

### Code Usage

The project is open-sourced under the [MIT license](LICENSE.md).

### Acknowledgements

This repository was created from an [existing private codebase](https://github.com/JamesLongman/DIGBot/releases/tag/0.0.1). The previous project was headed by Maelstromeous who was ultimately responsible for code review, design decisions and deployment.

File contributions were as follows  
Maelstromeous: 510 commits,  7,623 additions, 6,378 deletions  
JamesLongman: 459 commits, 30,076 additions, 18,144 deletions  
Euwas: 37 commits, 1,982 additions, 1040 deletions  
CptCannonFodder: 10 commits, 22 additions, 16 deletions  
Blacky704: 3 commits, 29 additions, 8 deletions  
