package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/core"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/discord"
	"github.com/dignityofwar/digbot/interactor"
	"log"
)

type Meep struct {
	Test string
}

var Module = core.Module{
	Name: "Herald",
	OnInit: func() {
		if err := db.Connection.AutoMigrate(&RoleMessageEntity{}, &JoinMessageEntity{}); err != nil {
			log.Fatalf("Unable to migrate messenger entities: %v", err)
		}

		discord.Discord.AddHandler(func(s *discordgo.Session, m *discordgo.GuildMemberUpdate) {
			handleRoleAssign(s, m)
		})

		discord.Discord.AddHandler(func(s *discordgo.Session, m *discordgo.GuildMemberAdd) {
			handleJoin(s, m)
		})
	},
	OnBoot: func() {
		err := interactor.RegisterCommand(&interactor.SlashCommandGroup{
			Name:        "herald",
			Description: "Manage automated messages send by the bot",
			SubCommands: []interactor.CommandOptions{
				roleCommands,
			},
		}, nil)

		if err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterButtonComponent(editRoleMessageButton); err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterButtonComponent(deleteRoleMessageButton); err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterSelectorComponent(roleMessageRoleSelect); err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterSelectorComponent(roleMessageChannelSelect); err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterModal(editRoleMessageModal); err != nil {
			log.Fatalf(err.Error())
		}
	},
}
