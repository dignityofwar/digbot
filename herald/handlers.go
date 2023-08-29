package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
)

func handleRoleAssign(s *discordgo.Session, m *discordgo.GuildMemberUpdate) {
thisOne:
	for _, role := range m.Roles {
		for _, prev := range m.BeforeUpdate.Roles {
			if role == prev {
				continue thisOne
			}
		}

		var messages []RoleMessageEntity

		db.Connection.Where(&RoleMessageEntity{
			MessageEntity: MessageEntity{GuildID: m.GuildID},
			RoleID:        role,
		}).Find(&messages)

		for _, message := range messages {

			message.send(s, m.Member)
		}
	}
}

func handleJoin(s *discordgo.Session, m *discordgo.GuildMemberAdd) {
	var messages []JoinMessageEntity

	db.Connection.Where(&JoinMessageEntity{
		MessageEntity: MessageEntity{GuildID: m.GuildID},
	}).Find(&messages)

	for _, message := range messages {
		message.send(s, m.Member)
	}
}
