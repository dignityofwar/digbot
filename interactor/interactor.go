package interactor

import (
	"github.com/dignityofwar/digbot/core"
	"github.com/dignityofwar/digbot/discord"
	"log"
)

var Module = core.Module{
	Name: "Interactor",
	OnInit: func() {
		log.Println("Setting up Interactor")

		discord.Discord.AddHandler(interactionHandler)
	},
}
