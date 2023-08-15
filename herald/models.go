package herald

import (
	"github.com/dignityofwar/digbot/discord"
	"time"
)

type MessageEntity struct {
	GuildID   string           `gorm:"primaryKey"`
	GuildRef  discord.GuildRef `gorm:"foreignKey:GuildID"`
	ChannelID string           `gorm:"primaryKey"`
	Content   string
}

type RoleMessageEntity struct {
	RoleID        string `gorm:"primaryKey"`
	Role          discord.RoleRef
	MessageEntity `gorm:"embedded"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type JoinMessageEntity struct {
	MessageEntity `gorm:"embedded"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
