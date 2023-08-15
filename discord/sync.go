package discord

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/db"
	"gorm.io/gorm/clause"
	"log"
	"time"
)

type GuildRef struct {
	ID            string `gorm:"primaryKey"`
	InactiveSince *time.Time
}

type ChannelRef struct {
	ID        string `gorm:"primaryKey"`
	GuildID   string `gorm:"primaryKey"`
	Available bool
	Guild     GuildRef `gorm:"constraint:OnDelete:CASCADE"`
}

type RoleRef struct {
	ID        string `gorm:"primaryKey"`
	GuildID   string `gorm:"primaryKey"`
	Available bool
	Guild     GuildRef `gorm:"constraint:OnDelete:CASCADE"`
}

func initSync() {
	if err := db.Connection.AutoMigrate(&GuildRef{}, &ChannelRef{}, &RoleRef{}); err != nil {
		log.Fatalf("Failed to migrate sync to db: %v", err)
	}

	now := time.Now()

	db.Connection.Updates(&GuildRef{
		InactiveSince: &now,
	})

	Discord.AddHandler(func(s *discordgo.Session, g *discordgo.GuildCreate) {
		log.Printf("Guild became available: %s(%s) %t\n", g.Name, g.ID, g.Unavailable)

		db.Connection.Clauses(clause.OnConflict{
			UpdateAll: true,
		}).Create(&GuildRef{
			ID:            g.ID,
			InactiveSince: nil,
		})

		{
			db.Connection.Model(&ChannelRef{}).Where(&ChannelRef{GuildID: g.ID}).Updates(&ChannelRef{Available: false})

			channels := make([]ChannelRef, len(g.Channels))
			for i, c := range g.Channels {
				channels[i] = ChannelRef{
					ID:        c.ID,
					GuildID:   g.ID,
					Available: true,
				}
			}

			db.Connection.Clauses(clause.OnConflict{
				UpdateAll: true,
			}).Create(&channels)
		}
		{
			db.Connection.Model(&RoleRef{}).Where(&RoleRef{GuildID: g.ID}).Update("available", false)

			roles := make([]RoleRef, len(g.Roles))
			for i, r := range g.Roles {
				roles[i] = RoleRef{
					ID:        r.ID,
					GuildID:   g.ID,
					Available: true,
				}
			}

			db.Connection.Clauses(clause.OnConflict{
				UpdateAll: true,
			}).Create(&roles)
		}
	})

	Discord.AddHandler(func(s *discordgo.Session, g *discordgo.GuildDelete) {
		if g.Unavailable {
			now := time.Now()

			db.Connection.Save(&GuildRef{
				ID:            g.ID,
				InactiveSince: &now,
			})
		} else {
			db.Connection.Delete(GuildRef{}, g.ID)
		}
	})

	Discord.AddHandler(func(s *discordgo.Session, c *discordgo.ChannelCreate) {
		db.Connection.Save(&ChannelRef{
			ID:        c.ID,
			GuildID:   c.GuildID,
			Available: true,
		})
	})

	Discord.AddHandler(func(s *discordgo.Session, c *discordgo.ChannelDelete) {
		db.Connection.Delete(&ChannelRef{
			ID:      c.ID,
			GuildID: c.GuildID,
		})
	})

	Discord.AddHandler(func(s *discordgo.Session, r *discordgo.GuildRoleCreate) {
		db.Connection.Save(&RoleRef{
			ID:      r.Role.ID,
			GuildID: r.GuildID,
		})
	})

	Discord.AddHandler(func(s *discordgo.Session, r *discordgo.GuildRoleDelete) {
		db.Connection.Delete(&RoleRef{
			ID:      r.RoleID,
			GuildID: r.GuildID,
		})
	})

}
