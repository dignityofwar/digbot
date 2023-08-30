package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/core"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/discord"
	"github.com/dignityofwar/digbot/interactor"
	"log"
)

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
				joinCommands,
			},
		}, &interactor.CommandPermissions{
			DefaultMemberPermissions: ptr[int64](0),
			DMPermission:             ptr(false),
		})

		if err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterButtonComponents(
			editRoleMessageButton,
			deleteRoleMessageButton,
			editJoinMessageButton,
			deleteJoinMessageButton,
		); err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterSelectorComponents(
			roleMessageRoleSelect,
			roleMessageChannelSelect,
			joinMessageChannelSelect,
		); err != nil {
			log.Fatalf(err.Error())
		}

		if err := interactor.RegisterModals(
			createRoleMessageModal,
			editRoleMessageModal,
			createJoinMessageModal,
			editJoinMessageModal,
		); err != nil {
			log.Fatalf(err.Error())
		}
	},
}
