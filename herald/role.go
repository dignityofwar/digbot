package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"gorm.io/gorm/clause"
)

type RoleMessageParams struct {
	Role    *discordgo.Role    `description:"Trigger on assignment of" required:"true"`
	Channel *discordgo.Channel `description:"Send message to" channels:"GuildText"`
}

func listRoleMessages(ctx *interactor.SlashCommandContext, params *RoleMessageParams) {
	//
}

type EditRoleMessageParams struct {
	Message string `description:"Content of the message" required:"true"`
	RoleMessageParams
}

func editRoleMessage(ctx *interactor.SlashCommandContext, params *EditRoleMessageParams) {
	channelID := ""
	if params.Channel != nil {
		channelID = params.Channel.ID
	}

	db.Connection.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&RoleMessageEntity{
		MessageEntity: MessageEntity{
			GuildID:   ctx.Interaction.GuildID,
			ChannelID: channelID,
			Content:   params.Message,
		},
		RoleID: params.Role.ID,
	})

	ctx.Session.InteractionRespond(ctx.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Message updated",
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

func deleteRoleMessage(ctx *interactor.SlashCommandContext, params *RoleMessageParams) {
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
}
