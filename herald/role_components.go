package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"github.com/mattn/go-sqlite3"
)

const editRoleMessageButtonID = "herald_role_edit"

var editRoleMessageButton = &interactor.ButtonOptions{
	ComponentID: editRoleMessageButtonID,
	Style:       discordgo.PrimaryButton,
	Label:       "Edit",
	Callback: func(ctx *interactor.MessageComponentContext) error {
		return ctx.ModalRespond(&interactor.Modal{
			ModalID: editRoleMessageModalID,
			ID:      ctx.ID,
			Title:   "Create message",
		})
	},
}

//
//
//

const deleteRoleMessageButtonID = "herald_role_delete"

var deleteRoleMessageButton = &interactor.ButtonOptions{
	ComponentID: deleteRoleMessageButtonID,
	Style:       discordgo.DangerButton,
	Label:       "Delete",
	Callback: func(ctx *interactor.MessageComponentContext) error {
		db.Connection.Delete(&RoleMessageEntity{}, ctx.ID)

		return ctx.Respond(&discordgo.InteractionResponse{
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
	},
}

//
//
//

const roleMessageRoleSelectID = "herald_role_role"

var roleMessageRoleSelect = &interactor.SelectMenuOptions{
	ComponentID: roleMessageRoleSelectID,
	Placeholder: "Change role",
	MinValues:   ptr(1),
	MaxValues:   1,
	Callback: func(ctx *interactor.MessageComponentContext, values []*discordgo.Role) error {
		var message RoleMessageEntity
		if db.Connection.First(&message, ctx.ID).Error != nil {
			return ctx.UpsertRespond(roleResponseNotFound)
		}

		updatedMessage := message

		updatedMessage.RoleID = values[0].ID

		if err := db.Connection.Save(updatedMessage).Error; err != nil {
			switch err.(sqlite3.Error).ExtendedCode {
			case sqlite3.ErrConstraintUnique:
				return ctx.Respond(&discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseUpdateMessage,
					Data: formatRoleMessageResponse(&ctx.Context, &message, roleResponseNotificationFailed),
				})
			}

			return err
		}

		return ctx.Respond(&discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: formatRoleMessageResponse(&ctx.Context, &updatedMessage, roleResponseNotificationUpdated),
		})
	},
}

//
//
//

const roleMessageChannelSelectID = "herald_role_channel"

var roleMessageChannelSelect = &interactor.SelectMenuOptions{
	ComponentID: roleMessageChannelSelectID,
	Placeholder: "Change channel",
	MinValues:   ptr(0),
	MaxValues:   1,
	ChannelTypes: []discordgo.ChannelType{
		discordgo.ChannelTypeGuildText,
	},
	Callback: func(ctx *interactor.MessageComponentContext, values []*discordgo.Channel) error {
		var message RoleMessageEntity
		if db.Connection.First(&message, ctx.ID).Error != nil {
			return ctx.UpsertRespond(roleResponseNotFound)
		}

		updatedMessage := message

		if len(values) == 0 {
			updatedMessage.ChannelID = ptr("")
		} else {
			updatedMessage.ChannelID = &values[0].ID
		}

		if err := db.Connection.Save(updatedMessage).Error; err != nil {
			switch err.(sqlite3.Error).ExtendedCode {
			case sqlite3.ErrConstraintUnique:
				return ctx.Respond(&discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseUpdateMessage,
					Data: formatRoleMessageResponse(&ctx.Context, &message, roleResponseNotificationFailed),
				})
			}

			return err
		}

		return ctx.Respond(&discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: formatRoleMessageResponse(&ctx.Context, &updatedMessage, roleResponseNotificationUpdated),
		})
	},
}
