package db

import (
	"github.com/dignityofwar/digbot/config"
	"github.com/dignityofwar/digbot/core"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Connection *gorm.DB

var Module = core.Module{
	Name: "DB",
	OnInit: func() {
		var err error

		Connection, err = gorm.Open(sqlite.Open(config.DB.FilePath), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Silent),
		})

		if err != nil {
			panic(err)
		}
	},
}
