package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/interactor"
)

var roleResponseNotFound = &discordgo.InteractionResponseData{
	Embeds: []*discordgo.MessageEmbed{{
		Description: "Could not update message as it does not exist",
		Color:       interactor.ColorError,
	}},
	Flags: discordgo.MessageFlagsEphemeral,
}
