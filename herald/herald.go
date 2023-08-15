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
		err := interactor.RegisterCommand(&interactor.SlashCommandOptions{
			Type:        interactor.SlashCommandGroup,
			Name:        "herald",
			Description: "Manage automated messages send by the bot",
			SubCommands: []*interactor.SlashCommandOptions{
				{
					Type:        interactor.SlashCommandGroup,
					Name:        "role",
					Description: "Manage messages send when a member receives a role",
					SubCommands: []*interactor.SlashCommandOptions{
						//{
						//	Type:        interactor.SlashCommand,
						//	Name:        "list",
						//	Description: "List role messages",
						//	Callback:    listRoleMessages,
						//},
						{
							Type:        interactor.SlashCommand,
							Name:        "edit",
							Description: "Edit role message",
							Callback:    editRoleMessage,
						},
						{
							Type:        interactor.SlashCommand,
							Name:        "delete",
							Description: "Delete role message",
							Callback:    deleteRoleMessage,
						},
					},
				},
				{
					Type:        interactor.SlashCommandGroup,
					Name:        "join",
					Description: "Manage messages send when a member joins the server",
					SubCommands: []*interactor.SlashCommandOptions{
						{
							Type:        interactor.SlashCommand,
							Name:        "edit",
							Description: "Edit join message",
							Callback:    editJoinMessage,
						},
						{
							Type:        interactor.SlashCommand,
							Name:        "delete",
							Description: "Delete join message",
							Callback:    deleteJoinMessage,
						},
					},
				},
			},
		}, nil)

		if err != nil {
			log.Fatalf(err.Error())
		}
	},
}
