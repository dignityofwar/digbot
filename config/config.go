package config

import (
	"github.com/dignityofwar/digbot/core"
	"github.com/joho/godotenv"
	"log"
	"os"
	"reflect"
)

var (
	Discord struct {
		Token string `env:"DISCORD_TOKEN"`
	}

	DB struct {
		FilePath string `env:"DB_PATH" default:"./data/db.sqlite"`
	}
)

var Module = core.Module{
	Name: "Config",
	OnInit: func() {
		log.Println("Loading config")

		godotenv.Load()

		initConfigStruct(&Discord)
		initConfigStruct(&DB)
	},
}

func initConfigStruct(config any) {
	configValue := reflect.ValueOf(config).Elem()
	configType := configValue.Type()

	for i := 0; i < configType.NumField(); i++ {
		fieldValue := configValue.Field(i)
		fieldType := configType.Field(i)

		// TODO: Add parsing to support int, float, bool, arrays
		fieldValue.SetString(fieldType.Tag.Get("default"))

		if key, ok := fieldType.Tag.Lookup("env"); ok {
			if value := os.Getenv(key); value != "" {
				fieldValue.SetString(value)
			}
		}
	}
}
