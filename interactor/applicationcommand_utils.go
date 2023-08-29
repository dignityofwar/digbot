package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
	"strings"
)

func resolveCommandOptionType(i reflect.Type) (optionType discordgo.ApplicationCommandOptionType, err error) {
	//TODO: Support user and members
	switch i {
	case reflect.TypeOf(""):
		optionType = discordgo.ApplicationCommandOptionString
	case reflect.TypeOf(int64(0)):
		optionType = discordgo.ApplicationCommandOptionInteger
	case reflect.TypeOf(true):
		optionType = discordgo.ApplicationCommandOptionBoolean
	case reflect.TypeOf((*discordgo.Member)(nil)):
		optionType = discordgo.ApplicationCommandOptionUser
	case reflect.TypeOf((*discordgo.Channel)(nil)):
		optionType = discordgo.ApplicationCommandOptionChannel
	case reflect.TypeOf((*discordgo.Role)(nil)):
		optionType = discordgo.ApplicationCommandOptionRole
	case reflect.TypeOf((*Mentionable)(nil)):
		optionType = discordgo.ApplicationCommandOptionMentionable
	case reflect.TypeOf(float64(0)):
		optionType = discordgo.ApplicationCommandOptionNumber
	case reflect.TypeOf((*discordgo.MessageAttachment)(nil)):
		optionType = discordgo.ApplicationCommandOptionAttachment
	default:
		err = errors.New("nope")
	}

	return
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

func castCommandOption(o *discordgo.ApplicationCommandInteractionDataOption, r *discordgo.ApplicationCommandInteractionDataResolved) reflect.Value {
	switch o.Type {
	case discordgo.ApplicationCommandOptionString:
		return reflect.ValueOf(o.Value)
	case discordgo.ApplicationCommandOptionInteger:
		return reflect.ValueOf(int64(o.Value.(float64)))
	case discordgo.ApplicationCommandOptionBoolean:
		return reflect.ValueOf(o.Value)
	case discordgo.ApplicationCommandOptionNumber:
		return reflect.ValueOf(o.Value)
	case discordgo.ApplicationCommandOptionUser:
		return reflect.ValueOf(r.Members[o.Value.(string)])
	case discordgo.ApplicationCommandOptionChannel:
		return reflect.ValueOf(r.Channels[o.Value.(string)])
	case discordgo.ApplicationCommandOptionRole:
		return reflect.ValueOf(r.Roles[o.Value.(string)])
	case discordgo.ApplicationCommandOptionMentionable:
		// TODO: Find actual value to assign
		return reflect.ValueOf(&Mentionable{})
	case discordgo.ApplicationCommandOptionAttachment:
		return reflect.ValueOf(r.Attachments[o.Value.(string)])
	}

	panic("No idea what I am suppose to do with that type: " + o.Name)
}
