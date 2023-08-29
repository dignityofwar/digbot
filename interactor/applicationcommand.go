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

	ap, desc, err := cmd.compileCommand(perms)

	if err != nil {
		return
	}

	res, err := discord.Discord.ApplicationCommandCreate(discord.Discord.State.User.ID, "", ap)

	if err != nil {
		return
	}

	log.Println("Registered command: " + ap.Name + "(" + res.Version + ")")

	commandHandlers[ap.Name] = desc

	return
}
