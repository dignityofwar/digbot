<div align="center">
  <img src="https://i.imgur.com/0V1aNuw.png"/>

# DigBot

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dignityofwar/digbot?label=version)](https://github.com/dignityofwar/digbot/releases)
[![GitHub](https://img.shields.io/github/license/dignityofwar/digbot)](https://github.com/dignityofwar/digbot/blob/main/LICENSE)
</div>

## About

DigBot is a custom discord bot ran on the [DIG community's discord server](https://discord.gg/cjQBNpc), it was
originally created to fulfil all the functionality of the current bots that were on the server and allow the community
to implement any feature's they desired.

## Usage

DigBot is releases as a Docker image on [Docker Hub](https://hub.docker.com/r/dignityofwar/digbot). Pull the latest
version using `docker pull dignityofwar/digbot:latest`.

To configure DigBot the following environment variables:

- `DISCORD_TOKEN`: a Discord Bot application token, which can be created in
  the [Discord developer portal](https://discord.com/developers/applications);
- `DB_PATH`: path to the Sqlite database file.

## Code Usage

The project is open-sourced under the [MIT license](LICENSE).

## Acknowledgements

This repository was created from
an [existing private codebase](https://github.com/JamesLongman/DIGBot/releases/tag/0.0.1). The previous project was
headed by Maelstromeous who was ultimately responsible for code review, design decisions and deployment.

File contributions were as follows  
Maelstromeous: 510 commits, 7,623 additions, 6,378 deletions  
JamesLongman: 459 commits, 30,076 additions, 18,144 deletions  
Euwas: 37 commits, 1,982 additions, 1040 deletions  
CptCannonFodder: 10 commits, 22 additions, 16 deletions  
Blacky704: 3 commits, 29 additions, 8 deletions  
