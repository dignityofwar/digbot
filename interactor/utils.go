package interactor

import (
	"github.com/bwmarrin/discordgo"
	"reflect"
	"strings"
)

func resolveOptionType(i reflect.Type) (discordgo.ApplicationCommandOptionType, bool) {
	switch i {
	case reflect.TypeOf(""):
		return discordgo.ApplicationCommandOptionString, true
	case reflect.TypeOf(int64(0)):
		return discordgo.ApplicationCommandOptionInteger, true
	case reflect.TypeOf(true):
		return discordgo.ApplicationCommandOptionBoolean, true
	case reflect.TypeOf((*discordgo.User)(nil)):
		return discordgo.ApplicationCommandOptionUser, true
	case reflect.TypeOf((*discordgo.Channel)(nil)):
		return discordgo.ApplicationCommandOptionChannel, true
	case reflect.TypeOf((*discordgo.Role)(nil)):
		return discordgo.ApplicationCommandOptionRole, true
	case reflect.TypeOf((*Mentionable)(nil)):
		return discordgo.ApplicationCommandOptionMentionable, true
	case reflect.TypeOf(float64(0)):
		return discordgo.ApplicationCommandOptionNumber, true
	case reflect.TypeOf((*discordgo.MessageAttachment)(nil)):
		return discordgo.ApplicationCommandOptionAttachment, true
	}

	return 0, false
}

func resolveOptionsChannelTypes(f reflect.StructField) []discordgo.ChannelType {
	if tag, ok := f.Tag.Lookup("channels"); ok {
		list := strings.Split(tag, ",")
		channelTypes := make([]discordgo.ChannelType, len(list))

		for i, channelType := range list {
			switch channelType {
			case "GuildText":
				channelTypes[i] = discordgo.ChannelTypeGuildText
			case "DM":
				channelTypes[i] = discordgo.ChannelTypeDM
			case "GuildVoice":
				channelTypes[i] = discordgo.ChannelTypeGuildVoice
			case "GroupDM":
				channelTypes[i] = discordgo.ChannelTypeGroupDM
			case "GuildCategory":
				channelTypes[i] = discordgo.ChannelTypeGuildCategory
			case "GuildNews":
				channelTypes[i] = discordgo.ChannelTypeGuildNews
			case "GuildStore":
				channelTypes[i] = discordgo.ChannelTypeGuildStore
			case "GuildNewsThread":
				channelTypes[i] = discordgo.ChannelTypeGuildNewsThread
			case "GuildPublicThread":
				channelTypes[i] = discordgo.ChannelTypeGuildPublicThread
			case "GuildPrivateThread":
				channelTypes[i] = discordgo.ChannelTypeGuildPrivateThread
			case "GuildStageVoice":
				channelTypes[i] = discordgo.ChannelTypeGuildStageVoice
			case "GuildForum":
				channelTypes[i] = discordgo.ChannelTypeGuildForum
			default:
				// TODO: Can't be arsed to do this properly for now
				panic("No clue what you want from me")
			}
		}

		return channelTypes
	}

	return nil
}
