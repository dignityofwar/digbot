If you require help please ask in the developer channel on discord

# Using Docker with DIGBot

Docker allows us to ensure all environments from local branches to production are identical, eliminating "it works on my machine" issues. We **HIGHLY** recomend that you use Docker for local development of DIGBot. If you choose not to you may encounter issues that will not be supported.

For more info on Docker, see: https://www.docker.com/what-docker

TL;DR: Docker splits parts of server software (e.g. Node, MySQL) into containers, which Docker then runs as separate instances. This ensures that we have the EXACT same server setup as we do on development.

# Installing Docker

## Note for Windows Users

Docker will **DISABLE** VirtualBox. This is because Docker requires the use of the Windows Hyper-V service (which runs linux virtual machines), which VirtualBox is incompatible with. If you have other things that use VirtualBox as a provider (e.g. Vagrant) then you'll have to come up with your own system of running this project.

## Requirements

* Windows: requires Windows 10 Professional or Enterprise 64-bit . If you have less than that, see https://docs.docker.com/toolbox/overview/.
* Windows: Recommended to get Cmder. However command prompt *should* do, but untested.
* Mac + Linux: No other requirements

## Download & Install Docker
Head to https://docs.docker.com/engine/installation/ and install the appropriate version for your development computer.

## Running the Bot

Once Docker is installed we can run the Bot.

1. Navigate to the project directory on your favourite command line terminal.
2. Run the command `docker-compose up --build` (assuming you have completed the other setup steps outlined in the contribution file)

What this will do is build the containers that will run the bot. First time running, this may take a little while as the bot requires some linux libraries.

Once the bot is running, your console should have a bunch of text showing the console output of the Bot itself.

## Restarting the bot

When you make changes, you'll have to restart the bot. To do this, simply stop the script (usually `control + c` or `cmd + c` on Macs) then `docker-compose up --build` again.

# Database

(This section is somewhat legacy from the old project, we need to decide what we are going to do regarding the database)

Firstly, you need to download a MySQL database client, e.g. MySQL Workbench (https://dev.mysql.com/downloads/workbench/ - scroll to bottom).

Then you'll need to add a connection using the following details:

* Host: 127.0.0.1
* Port: 3306
* User: root
* Password: root
* Database: DIG


# Running tests

Running the command `docker-compose -f docker-compose-test.yml up` will execute the tests locally.

# Troubleshooting

## Windows

### Supported versions

Only Windows 10 Pro is supported. If you need to upgrade, it's recommended you get Windows 10 pro anyway. There's some nice sites to get keys from, such as Software Geeks

### Shared drives

On Windows, if you are accessing your code from another drive other than C:/, you need to Share the drive. You can find this in Docker's settings.

### "file exists" error

Occasionally you may hit a file exists error while building your container. How I managed to fix it was to wipe your shared drive, press Apply, then reapply the drive, then run the container. Don't ask me why that worked.

### Other errors

You may experience a few other Docker based errors while attempting to run the project. Usually these can be solved by restarting docker and attempting to run the project a few times.
