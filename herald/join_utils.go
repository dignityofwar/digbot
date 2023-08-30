package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/interactor"
	"strconv"
)

func formatJoinMessageResponse(ctx *interactor.Context, joinMessage *JoinMessageEntity, embeds ...*discordgo.MessageEmbed) *discordgo.InteractionResponseData {
	id := strconv.Itoa(int(joinMessage.ID))
	channel := "DM"
	if *joinMessage.ChannelID != "" {
		channel = "<#" + *joinMessage.ChannelID + ">"
	}

	embeds = append(embeds, &discordgo.MessageEmbed{
		Description: joinMessage.compile(ctx.Interaction.Member),
		Color:       interactor.ColorPrimary,
		Fields: []*discordgo.MessageEmbedField{
			{
				Name:   "Channel",
				Value:  channel,
				Inline: true,
			},
		},
	})

	return &discordgo.InteractionResponseData{
		Flags:  discordgo.MessageFlagsEphemeral,
		Embeds: embeds,
		Components: []discordgo.MessageComponent{
			discordgo.ActionsRow{
				Components: []discordgo.MessageComponent{
					interactor.MakeMessageComponent(&interactor.MessageComponentOptions{
						ComponentID: joinMessageChannelSelectID,
						ID:          id,
					}),
				},
			},
			discordgo.ActionsRow{
				Components: []discordgo.MessageComponent{
					interactor.MakeMessageComponent(&interactor.MessageComponentOptions{
						ComponentID: editJoinMessageButtonID,
						ID:          id,
					}),
					interactor.MakeMessageComponent(&interactor.MessageComponentOptions{
						ComponentID: deleteJoinMessageButtonID,
						ID:          id,
					}),
				},
			},
		},
	}
}
