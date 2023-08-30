package interactor

import (
	"github.com/bwmarrin/discordgo"
	"reflect"
	"strconv"
)

func resolveTextInputLabel(t reflect.StructField) string {
	if label, has := t.Tag.Lookup("label"); has {
		return label
	}

	return t.Name
}

func resolveTextInputStyle(t reflect.StructField) discordgo.TextInputStyle {
	switch t.Tag.Get("style") {
	case "":
		return discordgo.TextInputShort
	case "short":
		return discordgo.TextInputShort
	case "paragraph":
		return discordgo.TextInputParagraph
	}

	panic("nope nope nope")
}

func resolveTextInputMinLength(t reflect.StructField) int {
	if min, err := strconv.Atoi(t.Tag.Get("min")); err != nil {
		return min
	}

	return 0
}

func resolveTextInputMaxLength(t reflect.StructField) int {
	if max, err := strconv.Atoi(t.Tag.Get("max")); err != nil {
		return max
	}

	return 0
}
