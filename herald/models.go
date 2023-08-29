package herald

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/discord"
	"log"
	"strings"
	"time"
)

type MessageEntity struct {
	ID        uint             `gorm:"primaryKey"`
	GuildID   string           `gorm:"index:,unique,composite:umc"`
	GuildRef  discord.GuildRef `gorm:"foreignKey:GuildID"`
	ChannelID string           `gorm:"index:,unique,composite:umc"`
	Content   string

	CreatedAt time.Time
	UpdatedAt time.Time
}

type RoleMessageEntity struct {
	MessageEntity `gorm:"embedded"`

	RoleID string `gorm:"index:,unique,composite:umc"`
	Role   discord.RoleRef
}

type JoinMessageEntity struct {
	MessageEntity `gorm:"embedded"`
}

func (msg *MessageEntity) compile(member *discordgo.Member) string {
	compiledMessage := strings.ReplaceAll(msg.Content, "@member", member.Mention())
	compiledMessage = strings.ReplaceAll(compiledMessage, "@username", member.User.Username)
	if member.Nick == "" {
		compiledMessage = strings.ReplaceAll(compiledMessage, "@name", member.User.Username)
	} else {
		compiledMessage = strings.ReplaceAll(compiledMessage, "@name", member.Nick)
	}

	return compiledMessage
}

func (msg *MessageEntity) send(s *discordgo.Session, member *discordgo.Member) {
	channelID := msg.ChannelID
	if channelID == "" {
		userChannel, err := s.UserChannelCreate(member.User.ID)
		if err != nil {
			log.Fatalf("Failed to create user channel: %v", err)
		}

		channelID = userChannel.ID
	}

	_, err := s.ChannelMessageSendComplex(channelID, &discordgo.MessageSend{
		Embed: &discordgo.MessageEmbed{
			Description: msg.compile(member),
		},
	})

	if err != nil {
		log.Fatalf("Failed to send message: %v", err)
	}
}
