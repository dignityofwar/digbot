<div align="center">
  <img src="https://i.imgur.com/0V1aNuw.png"/>

  # DigBot

  [![GitHub release (latest by date)](https://img.shields.io/github/v/release/dignityofwar/digbot?label=version)](https://github.com/dignityofwar/digbot/releases)
  ![Release](https://github.com/dignityofwar/digbot/actions/workflows/main.yml/badge.svg)
  ![Testing](https://github.com/dignityofwar/digbot/actions/workflows/test.yml/badge.svg)
  [![Dependecies](https://img.shields.io/librariesio/github/dignityofwar/digbot)](https://libraries.io/github/dignityofwar/digbot)
  [![GitHub](https://img.shields.io/github/license/dignityofwar/digbot)](https://github.com/dignityofwar/digbot/blob/main/LICENSE)
</div>

## About

DigBot is a custom discord bot ran on the [DIG community's discord server](https://discord.gg/cjQBNpc), it was originally created to fulfil all the functionality of the current bots that were on the server and allow the community to implement any feature's they desired.
  
## Usage

DigBot is releases as a Docker image on [Docker Hub](https://hub.docker.com/r/dignityofwar/digbot). Pull the latest version using `docker pull dignityofwar/digbot:latest`. Further requirements are a [MariaDB](https://mariadb.org/) database.

To configure DigBot the following environment variables:

- `DISCORD_TOKEN`: a Discord Bot application token, which can be created in the [Discord developer portal](https://discord.com/developers/applications);
- `DB_HOST`: the host address of MariaDB(default `localhost`);
- `DB_PORT`: the port at which MariaDB is exposed(default `3306`);
- `DB_NAME`: the database name(default `digbot`);
- `DB_USER`: the username to login to MariaDB(default `diglet`);
- `DB_PASS`: the password to login to MariaDB(default `pass`).

## Technical requirements

DigBot is written in Typescript on top of the [NestJS framework](https://nestjs.com/) and requires Node.js v16+.
Internally it uses [Detritus](https://detritusjs.com/), and [Mikro ORM](https://mikro-orm.io/) to manage the connections to Discord, and MariaDB respectively.
Whenever the bot is started it will try to update the database using migrations, with the exception when `NODE_ENV` is equal to `development`(this is the default).

## Code Usage

The project is open-sourced under the [MIT license](LICENSE).

## Acknowledgements

This repository was created from an [existing private codebase](https://github.com/JamesLongman/DIGBot/releases/tag/0.0.1). The previous project was headed by Maelstromeous who was ultimately responsible for code review, design decisions and deployment.

File contributions were as follows  
Maelstromeous: 510 commits,  7,623 additions, 6,378 deletions  
JamesLongman: 459 commits, 30,076 additions, 18,144 deletions  
Euwas: 37 commits, 1,982 additions, 1040 deletions  
CptCannonFodder: 10 commits, 22 additions, 16 deletions  
Blacky704: 3 commits, 29 additions, 8 deletions  
