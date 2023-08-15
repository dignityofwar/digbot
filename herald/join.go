package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"gorm.io/gorm/clause"
)

type JoinMessageParams struct {
	Channel *discordgo.Channel `description:"Send message to" channels:"GuildText"`
}

type EditJoinMessageParams struct {
	Message string `description:"Content of the message" required:"true"`
	JoinMessageParams
}

func editJoinMessage(ctx *interactor.SlashCommandContext, params *EditJoinMessageParams) {
	channelID := ""
	if params.Channel != nil {
		channelID = params.Channel.ID
	}

	db.Connection.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&JoinMessageEntity{
		MessageEntity: MessageEntity{
			GuildID:   ctx.Interaction.GuildID,
			ChannelID: channelID,
			Content:   params.Message,
		},
	})

	ctx.Session.InteractionRespond(ctx.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Message updated",
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

func deleteJoinMessage(ctx *interactor.SlashCommandContext, params *JoinMessageParams) {
	channelID := ""
	if params.Channel != nil {
		channelID = params.Channel.ID
	}

	d := db.Connection.Delete(&JoinMessageEntity{
		MessageEntity: MessageEntity{
			GuildID:   ctx.Interaction.GuildID,
			ChannelID: channelID,
		},
	})

	message := "No message exist for this channel"
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
}