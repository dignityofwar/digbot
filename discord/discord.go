package discord

import (
	"github.com/bwmarrin/discordgo"
	"github.com/dignityofwar/digbot/config"
	"github.com/dignityofwar/digbot/core"
	"log"
)

var Discord *discordgo.Session

var Module = core.Module{
	Name: "Discord",
	OnInit: func() {
		log.Println("Setting up Discord")

		var err error
		Discord, err = discordgo.New("Bot " + config.Discord.Token)
		Discord.Identify.Intents = 14219

		if err != nil {
			log.Fatalf("Invalid bot parameters: %v", err)
		}

		initSync()
	},
	OnBoot: func() {
		log.Println("Connecting to Discord")

		if err := Discord.Open(); err != nil {
			log.Fatalf("Failed to open Discord session: %v", err)
		}
	},
	OnDestroy: func() {
		Discord.Close()
	},
}
