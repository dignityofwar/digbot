package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/interactor"
	"strconv"
)

func formatRoleMessageResponse(ctx *interactor.Context, roleMessage *RoleMessageEntity, embeds ...*discordgo.MessageEmbed) *discordgo.InteractionResponseData {
	id := strconv.Itoa(int(roleMessage.ID))
	channel := "DM"
	if *roleMessage.ChannelID != "" {
		channel = "<#" + *roleMessage.ChannelID + ">"
	}

	embeds = append(embeds, &discordgo.MessageEmbed{
		Description: roleMessage.compile(ctx.Interaction.Member),
		Color:       interactor.ColorPrimary,
		Fields: []*discordgo.MessageEmbedField{
			{
				Name:   "Role",
				Value:  "<@&" + roleMessage.RoleID + ">",
				Inline: true,
			},
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
						ComponentID: roleMessageRoleSelectID,
						ID:          id,
					}),
				},
			},
			discordgo.ActionsRow{
				Components: []discordgo.MessageComponent{
					interactor.MakeMessageComponent(&interactor.MessageComponentOptions{
						ComponentID: roleMessageChannelSelectID,
						ID:          id,
					}),
				},
			},
			discordgo.ActionsRow{
				Components: []discordgo.MessageComponent{
					interactor.MakeMessageComponent(&interactor.MessageComponentOptions{
						ComponentID: editRoleMessageButtonID,
						ID:          id,
					}),
					interactor.MakeMessageComponent(&interactor.MessageComponentOptions{
						ComponentID: deleteRoleMessageButtonID,
						ID:          id,
					}),
				},
			},
		},
	}
}
