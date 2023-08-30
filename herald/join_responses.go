package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/interactor"
)

var joinResponseNotFound = &discordgo.InteractionResponseData{
	Embeds: []*discordgo.MessageEmbed{{
		Description: "Could not update message as it does not exist",
		Color:       interactor.ColorError,
	}},
	Flags: discordgo.MessageFlagsEphemeral,
}

var joinResponseNotificationUpdated = &discordgo.MessageEmbed{
	Description: "Join message updated",
	Color:       interactor.ColorSuccess,
}

var joinResponseNotificationFailed = &discordgo.MessageEmbed{
	Description: "Update failed as there already exist an message for this join + channel combination",
	Color:       interactor.ColorError,
}
