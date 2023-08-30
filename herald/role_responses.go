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

var roleResponseNotificationUpdated = &discordgo.MessageEmbed{
	Description: "Role message updated",
	Color:       interactor.ColorSuccess,
}

var roleResponseNotificationFailed = &discordgo.MessageEmbed{
	Description: "Update failed as there already exist an message for this role + channel combination",
	Color:       interactor.ColorError,
}
