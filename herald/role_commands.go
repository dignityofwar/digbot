package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"log"
)

type RoleMessageParams struct {
	Role    *discordgo.Role    `description:"Trigger on assignment of" required:"true"`
	Channel *discordgo.Channel `description:"Send message to" channels:"GuildText"`
}

var roleCommands = &interactor.SlashCommandGroup{
	Name:        "role",
	Description: "Manage messages send when a member receives a role",
	SubCommands: []interactor.CommandOptions{
		&interactor.SlashCommand{
			Name:        "find",
			Description: "Find role message",
			Callback: func(ctx *interactor.CommandContext, params *RoleMessageParams) {
				channelID := ""
				if params.Channel != nil {
					channelID = params.Channel.ID
				}

				var message = RoleMessageEntity{
					MessageEntity: MessageEntity{
						GuildID:   ctx.Interaction.GuildID,
						ChannelID: channelID,
					},
					RoleID: params.Role.ID,
				}

				res := db.Connection.First(&message)

				if res.Error == nil {
					err := ctx.Respond(&discordgo.InteractionResponse{
						Type: discordgo.InteractionResponseChannelMessageWithSource,
						Data: formatRoleMessageResponse(&ctx.Context, &message),
					})

					if err != nil {
						log.Fatalln(err)
					}
				} else {
					err := ctx.ModalRespond(&interactor.Modal{
						ModalID: editRoleMessageModalID,
						Title:   "Create message",
					})

					if err != nil {
						log.Fatalln(err)
					}
				}
			},
		},
		&interactor.SlashCommand{
			Name:        "list",
			Description: "List role messages",
			Callback: func(ctx *interactor.CommandContext, params *RoleMessageParams) {
				channelID := ""
				if params.Channel != nil {
					channelID = params.Channel.ID
				}

				d := db.Connection.Delete(&RoleMessageEntity{
					MessageEntity: MessageEntity{
						GuildID:   ctx.Interaction.GuildID,
						ChannelID: channelID,
					},
					RoleID: params.Role.ID,
				})

				message := "No message exist for this role + channel"
				if d.RowsAffected > 0 {
					message = "Message deleted"
				}

				ctx.Session.InteractionRespond(ctx.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Content: message,
						Flags:   discordgo.MessageFlagsEphemeral,
					},
				})
			},
		},
	},
}
