package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
)

const editRoleMessageButtonID = "herald_role_edit"

var editRoleMessageButton = &interactor.ButtonOptions{
	ComponentID: editRoleMessageButtonID,
	Style:       discordgo.PrimaryButton,
	Label:       "Edit",
	Callback: func(ctx *interactor.MessageComponentContext) {
		ctx.ModalRespond(&interactor.Modal{
			ModalID: editRoleMessageModalID,
			ID:      ctx.ID,
			Title:   "Create message",
		})
	},
}

const deleteRoleMessageButtonID = "herald_role_delete"

var deleteRoleMessageButton = &interactor.ButtonOptions{
	ComponentID: deleteRoleMessageButtonID,
	Style:       discordgo.DangerButton,
	Label:       "Delete",
	Callback: func(ctx *interactor.MessageComponentContext) {
		db.Connection.Delete(&RoleMessageEntity{}, ctx.ID)

		err := ctx.Respond(&discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					{
						Color:       interactor.ColorSuccess,
						Description: "Message deleted",
					},
				},
			},
		})

		if err != nil {
			panic(err)
		}
	},
}

const roleMessageRoleSelectID = "herald_role_role"

var roleMessageRoleSelect = &interactor.SelectMenuOptions{
	ComponentID: roleMessageRoleSelectID,
	Placeholder: "Change role",
	MinValues:   ptr(1),
	MaxValues:   1,
	Callback: func(ctx *interactor.MessageComponentContext, values []*discordgo.Role) {

		var message RoleMessageEntity
		if db.Connection.First(&message, ctx.ID).Error != nil {
			return
		}

		message.RoleID = values[0].ID

		if db.Connection.Save(message).Error != nil {
			return
		}

		//if res.RowsAffected == 0 {
		//	msg := "Message failed"
		//	if res.Error != nil {
		//		msg = res.Error.Error()
		//	}
		//
		//	err := ctx.Respond(&discordgo.InteractionResponse{
		//		Type: discordgo.InteractionResponseUpdateMessage,
		//		Data: formatRoleMessageResponse(&ctx.Context, &message, &discordgo.MessageEmbed{
		//			Color:       colorError,
		//			Description: msg,
		//		}),
		//	})
		//
		//	if err != nil {
		//		panic(err)
		//	}
		//} else {
		err := ctx.Respond(&discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: formatRoleMessageResponse(&ctx.Context, &message),
		})

		if err != nil {
			panic(err)
		}
		//}
	},
}

const roleMessageChannelSelectID = "herald_role_channel"

var roleMessageChannelSelect = &interactor.SelectMenuOptions{
	ComponentID: roleMessageChannelSelectID,
	Placeholder: "Change channel",
	MaxValues:   1,
	ChannelTypes: []discordgo.ChannelType{
		discordgo.ChannelTypeGuildText,
	},
	Callback: func(ctx *interactor.MessageComponentContext, values []*discordgo.Channel) {
		//roleID, channelID := parseRoleMessageID(ctx.ID)
		//
		//newChannelID := ""
		//if len(values) > 0 {
		//	newChannelID = values[0].ID
		//}
		//
		//var messages []RoleMessageEntity
		//db.Connection.Model(&messages).Clauses(clause.Returning{}).Where(RoleMessageEntity{
		//	MessageEntity: MessageEntity{
		//		GuildID:   ctx.Interaction.GuildID,
		//		ChannelID: channelID,
		//	},
		//	RoleID: roleID,
		//}).Updates(RoleMessageEntity{MessageEntity: MessageEntity{ChannelID: newChannelID}})
		//
		//err := ctx.UpsertRespond(formatRoleMessageResponse(&ctx.Context, &messages[0]))
		//
		//if err != nil {
		//	panic(err)
		//}
	},
}
