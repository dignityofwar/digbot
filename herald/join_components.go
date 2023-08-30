package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"github.com/mattn/go-sqlite3"
)

const editJoinMessageButtonID = "herald_join_edit"

var editJoinMessageButton = &interactor.ButtonOptions{
	ComponentID: editJoinMessageButtonID,
	Style:       discordgo.PrimaryButton,
	Label:       "Edit",
	Callback: func(ctx *interactor.MessageComponentContext) error {
		return ctx.ModalRespond(&interactor.Modal{
			ModalID: editJoinMessageModalID,
			ID:      ctx.ID,
			Title:   "Create message",
		})
	},
}

//
//
//

const deleteJoinMessageButtonID = "herald_join_delete"

var deleteJoinMessageButton = &interactor.ButtonOptions{
	ComponentID: deleteJoinMessageButtonID,
	Style:       discordgo.DangerButton,
	Label:       "Delete",
	Callback: func(ctx *interactor.MessageComponentContext) error {
		db.Connection.Delete(&JoinMessageEntity{}, ctx.ID)

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

const joinMessageChannelSelectID = "herald_join_channel"

var joinMessageChannelSelect = &interactor.SelectMenuOptions{
	ComponentID: joinMessageChannelSelectID,
	Placeholder: "Change channel",
	MinValues:   ptr(0),
	MaxValues:   1,
	ChannelTypes: []discordgo.ChannelType{
		discordgo.ChannelTypeGuildText,
	},
	Callback: func(ctx *interactor.MessageComponentContext, values []*discordgo.Channel) error {
		var message JoinMessageEntity
		if db.Connection.First(&message, ctx.ID).Error != nil {
			return ctx.UpsertRespond(joinResponseNotFound)
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
					Data: formatJoinMessageResponse(&ctx.Context, &message, joinResponseNotificationFailed),
				})
			}

			return err
		}

		return ctx.Respond(&discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: formatJoinMessageResponse(&ctx.Context, &updatedMessage, joinResponseNotificationUpdated),
		})
	},
}
