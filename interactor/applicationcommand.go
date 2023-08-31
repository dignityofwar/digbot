package interactor

import (
	"errors"
	"github.com/dignityofwar/digbot/discord"
	"log"
)

// TODO: split when CommandType is supported by discordgo
var (
	commandHandlers = make(map[string]commandExecuteDescriptor)
)

func RegisterCommand(cmd Command, perms *CommandPermissions) (err error) {
	if discord.Discord.State.User == nil {
		return errors.New("cannot register command as Discord is not ready")
	}

	if perms == nil {
		perms = &CommandPermissions{}
	}

	ac, desc, err := cmd.compileCommand(perms)

	if err != nil {
		return
	}

	if _, found := messageComponentHandlers[ac.Name]; found {
		return errors.New("command name is already registered")
	}

	res, err := discord.Discord.ApplicationCommandCreate(discord.Discord.State.User.ID, "", ac)

	if err != nil {
		return
	}

	log.Println("Registered command: " + ac.Name + "(" + res.Version + ")")

	commandHandlers[ac.Name] = desc

	return
}
