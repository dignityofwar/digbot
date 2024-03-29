package herald

import (
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"strings"
)

type EditRoleMessageParams struct {
	Message string `style:"paragraph" min:"1" max:"3500"`
}

const createRoleMessageModalID = "herald_role_create"

var createRoleMessageModal = &interactor.ModalOptions{
	ModalID: createRoleMessageModalID,
	Callback: func(ctx *interactor.ModalContext, params *EditRoleMessageParams) error {
		ids := strings.SplitN(ctx.ID, ":", 2)

		message := RoleMessageEntity{
			MessageEntity: MessageEntity{
				GuildID:   ctx.Interaction.GuildID,
				ChannelID: &ids[1],
				Content:   params.Message,
			},
			RoleID: ids[0],
		}

		if err := db.Connection.Save(&message).Error; err != nil {
			return err
		}

		return ctx.UpsertRespond(formatRoleMessageResponse(&ctx.Context, &message))
	},
}

const editRoleMessageModalID = "herald_role_edit"

var editRoleMessageModal = &interactor.ModalOptions{
	ModalID: editRoleMessageModalID,
	Callback: func(ctx *interactor.ModalContext, params *EditRoleMessageParams) error {
		var message RoleMessageEntity

		if db.Connection.First(&message, ctx.ID).Error != nil {
			return ctx.UpsertRespond(roleResponseNotFound)
		}

		message.Content = params.Message

		if err := db.Connection.Save(&message).Error; err != nil {
			return err
		}

		return ctx.UpsertRespond(formatRoleMessageResponse(&ctx.Context, &message, roleResponseNotificationUpdated))
	},
}
