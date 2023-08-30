package herald

import (
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
)

type EditJoinMessageParams struct {
	Message string
}

const createJoinMessageModalID = "herald_join_create"

var createJoinMessageModal = &interactor.ModalOptions{
	ModalID: createJoinMessageModalID,
	Callback: func(ctx *interactor.ModalContext, params *EditJoinMessageParams) error {
		message := JoinMessageEntity{
			MessageEntity: MessageEntity{
				GuildID:   ctx.Interaction.GuildID,
				ChannelID: &ctx.ID,
				Content:   params.Message,
			},
		}

		if err := db.Connection.Save(&message).Error; err != nil {
			return err
		}

		return ctx.UpsertRespond(formatJoinMessageResponse(&ctx.Context, &message))
	},
}

const editJoinMessageModalID = "herald_join_edit"

var editJoinMessageModal = &interactor.ModalOptions{
	ModalID: editJoinMessageModalID,
	Callback: func(ctx *interactor.ModalContext, params *EditJoinMessageParams) error {
		var message JoinMessageEntity

		if db.Connection.First(&message, ctx.ID).Error != nil {
			return ctx.UpsertRespond(joinResponseNotFound)
		}

		message.Content = params.Message

		if err := db.Connection.Save(&message).Error; err != nil {
			return err
		}

		return ctx.UpsertRespond(formatJoinMessageResponse(&ctx.Context, &message, joinResponseNotificationUpdated))
	},
}
