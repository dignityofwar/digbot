package herald

import (
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/interactor"
	"gorm.io/gorm/clause"
	"strconv"
	"strings"
)

type EditMessageParams struct {
	Message string
}

const createRoleMessageModalID = "herald_role_create"

var createRoleMessageModal = &interactor.ModalOptions{
	ModalID: createRoleMessageModalID,
	Callback: func(ctx *interactor.ModalContext, params *EditMessageParams) {
		ids := strings.SplitN(ctx.ID, ":", 2)

		message := RoleMessageEntity{
			MessageEntity: MessageEntity{
				GuildID:   ctx.Interaction.GuildID,
				ChannelID: ids[1],
				Content:   params.Message,
			},
			RoleID: ids[0],
		}

		if db.Connection.Save(&message).Error != nil {
			return
		}

		err := ctx.UpsertRespond(formatRoleMessageResponse(&ctx.Context, &message))

		if err != nil {
			panic(err)
		}
	},
}

const editRoleMessageModalID = "herald_role_edit"

var editRoleMessageModal = &interactor.ModalOptions{
	ModalID: editRoleMessageModalID,
	Callback: func(ctx *interactor.ModalContext, params *EditMessageParams) {
		var message RoleMessageEntity

		if db.Connection.First(&message, ctx.ID).Error != nil {
			return
		}

		if id, err := strconv.Atoi(ctx.ID); err != nil {
			message.ID = uint(id)
		}

		db.Connection.Clauses(clause.OnConflict{
			UpdateAll: true,
		}).Create(&message)

		err := ctx.UpsertRespond(formatRoleMessageResponse(&ctx.Context, &message))

		if err != nil {
			panic(err)
		}
	},
}
