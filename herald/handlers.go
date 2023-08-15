package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"log"
	"strings"
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
			messengerSend(&message.MessageEntity, s, m.Member)
		}
	}
}

func handleJoin(s *discordgo.Session, m *discordgo.GuildMemberAdd) {
	var messages []JoinMessageEntity

	db.Connection.Where(&JoinMessageEntity{
		MessageEntity: MessageEntity{GuildID: m.GuildID},
	}).Find(&messages)

	for _, message := range messages {
		messengerSend(&message.MessageEntity, s, m.Member)
	}
}

func messengerSend(message *MessageEntity, session *discordgo.Session, member *discordgo.Member) {
	channelID := message.ChannelID
	if channelID == "" {
		userChannel, err := session.UserChannelCreate(member.User.ID)
		if err != nil {
			log.Fatalf("Failed to create user channel: %v", err)
		}

		channelID = userChannel.ID
	}

	compiledMessage := strings.ReplaceAll(message.Content, "@member", member.Mention())
	compiledMessage = strings.ReplaceAll(compiledMessage, "@username", member.User.Username)
	if member.Nick == "" {
		compiledMessage = strings.ReplaceAll(compiledMessage, "@name", member.User.Username)
	} else {
		compiledMessage = strings.ReplaceAll(compiledMessage, "@name", member.Nick)

	}

	_, err := session.ChannelMessageSendComplex(channelID, &discordgo.MessageSend{
		Embed: &discordgo.MessageEmbed{
			Description: compiledMessage,
		},
	})
	if err != nil {
		log.Fatalf("Failed to send message: %v", err)
	}
}
