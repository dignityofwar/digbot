package main

import (
	"github.com/dignityofwar/digbot/config"
	"github.com/dignityofwar/digbot/core"
	"github.com/dignityofwar/digbot/db"
	"github.com/dignityofwar/digbot/discord"
	"github.com/dignityofwar/digbot/herald"
	"github.com/dignityofwar/digbot/interactor"
	"log"
)

func main() {
	app := core.CreateApp([]core.Module{
		config.Module,
		db.Module,
		discord.Module,
		interactor.Module,
		herald.Module,
	})
	app.Start()

	app.AwaitExit()

	log.Println("Goodbye :)")
}
