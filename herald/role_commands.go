package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
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
			Callback: func(ctx *interactor.CommandContext, params *RoleMessageParams) error {
				channelID := ""
				if params.Channel != nil {
					channelID = params.Channel.ID
				}

				var message RoleMessageEntity

				res := db.Connection.Where(RoleMessageEntity{
					MessageEntity: MessageEntity{
						GuildID:   ctx.Interaction.GuildID,
						ChannelID: &channelID,
					},
					RoleID: params.Role.ID,
				}).First(&message)

				if res.Error == nil {
					return ctx.Respond(&discordgo.InteractionResponse{
						Type: discordgo.InteractionResponseChannelMessageWithSource,
						Data: formatRoleMessageResponse(&ctx.Context, &message),
					})

				} else {
					return ctx.ModalRespond(&interactor.Modal{
						ModalID: createRoleMessageModalID,
						Title:   "Create message",
						ID:      params.Role.ID + ":" + channelID,
					})
				}
			},
		},
	},
}
