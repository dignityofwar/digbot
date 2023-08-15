package db

import (
	"github.com/dignityofwar/digbot/config"
	"github.com/dignityofwar/digbot/core"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var Connection *gorm.DB

var Module = core.Module{
	Name: "DB",
	OnInit: func() {
		var err error

		Connection, err = gorm.Open(sqlite.Open(config.DB.FilePath))

		if err != nil {
			panic(err)
		}
	},
}
