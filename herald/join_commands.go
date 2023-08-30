package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
)

type JoinMessageParams struct {
	Channel *discordgo.Channel `description:"Send message to" channels:"GuildText"`
}

var joinCommands = &interactor.SlashCommandGroup{
	Name:        "join",
	Description: "Manage messages send when a new member joins the server",
	SubCommands: []interactor.CommandOptions{
		&interactor.SlashCommand{
			Name:        "find",
			Description: "Find join message",
			Callback: func(ctx *interactor.CommandContext, params *JoinMessageParams) error {
				channelID := ""
				if params.Channel != nil {
					channelID = params.Channel.ID
				}

				var message JoinMessageEntity

				res := db.Connection.Where(JoinMessageEntity{
					MessageEntity: MessageEntity{
						GuildID:   ctx.Interaction.GuildID,
						ChannelID: &channelID,
					},
				}).First(&message)

				if res.Error == nil {
					return ctx.Respond(&discordgo.InteractionResponse{
						Type: discordgo.InteractionResponseChannelMessageWithSource,
						Data: formatJoinMessageResponse(&ctx.Context, &message),
					})

				} else {
					return ctx.ModalRespond(&interactor.Modal{
						ModalID: createJoinMessageModalID,
						Title:   "Create message",
						ID:      channelID,
					})
				}
			},
		},
	},
}
