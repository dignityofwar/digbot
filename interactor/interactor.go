package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/core"
	"github.com/dignityofwar/digbot/discord"
	"log"
)

var (
	commandHandlers = make(map[string]*slashCommand)
)

var Module = core.Module{
	Name: "Interactor",
	OnInit: func() {
		log.Println("Setting up Interactor")

		discord.Discord.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			switch i.Type {
			case discordgo.InteractionApplicationCommand:
				data := i.ApplicationCommandData()

				if command, ok := commandHandlers[data.Name]; ok {
					ctx := &SlashCommandContext{
						Session:     s,
						Interaction: i.Interaction,
						Data:        &data,
					}

					command.execute(ctx, data.Options)
				}
			}
		})
	},
}

func RegisterCommand(cmd *SlashCommandOptions, perms *SlashCommandPermissions) (err error) {
	if discord.Discord.State.User == nil {
		return errors.New("cannot register command as Discord is not ready")
	}

	options, handler, err := cmd.build(perms)

	if err != nil {
		return
	}

	res, err := discord.Discord.ApplicationCommandCreate(discord.Discord.State.User.ID, "", options)

	if err != nil {
		return
	}

	log.Println("Registered command: " + cmd.Name + "(" + res.Version + ")")

	commandHandlers[cmd.Name] = handler

	return
}

//func clearCommands() {
//	commands, err := discord.ApplicationCommands(discord.State.User.ID, "")
//	if err != nil {
//		return
//	}
//
//	for _, command := range commands {
//		err := discord.ApplicationCommandDelete(discord.State.User.ID, "", command.ID)
//		if err != nil {
//			//
//		}
//	}
//}
