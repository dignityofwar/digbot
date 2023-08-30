package herald

import (
	"fmt"
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/discord"
	"log"
	"strings"
	"time"
)

type MessageEntity struct {
	ID         uint                `gorm:"primaryKey"`
	GuildID    string              `gorm:"not null;index:,unique,composite:umc"`
	GuildRef   *discord.GuildRef   `gorm:"foreignKey:GuildID"`
	ChannelID  *string             `gorm:"index:,unique,composite:umc"`
	ChannelRef *discord.ChannelRef `gorm:"foreignKey:ChannelID"`
	Content    string              `gorm:"not null"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type RoleMessageEntity struct {
	MessageEntity `gorm:"embedded"`

	RoleID  string          `gorm:"not null;index:,unique,composite:umc"`
	RoleRef discord.RoleRef `gorm:"foreignKey:RoleID"`
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
	embed := &discordgo.MessageEmbed{
		Description: msg.compile(member),
	}

	channelID := ""
	if *msg.ChannelID == "" {
		userChannel, err := s.UserChannelCreate(member.User.ID)
		if err != nil {
			log.Fatalf("Failed to create user channel: %v", err)
		}

		guild, _ := s.State.Guild(member.GuildID)

		channelID = userChannel.ID
		embed.Footer = &discordgo.MessageEmbedFooter{
			Text:    fmt.Sprintf("Welcome message from %s", guild.Name),
			IconURL: guild.IconURL("128"),
		}
	} else {
		channelID = *msg.ChannelID
	}

	_, err := s.ChannelMessageSendComplex(channelID, &discordgo.MessageSend{
		Embed: embed,
	})

	if err != nil {
		log.Fatalf("Failed to send message: %v", err)
	}
}
