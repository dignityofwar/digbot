package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
	"strconv"
	"strings"
)

func resolveCommandOptionType(i reflect.Type) (optionType discordgo.ApplicationCommandOptionType, err error) {
	if i.Kind() == reflect.String {
		optionType = discordgo.ApplicationCommandOptionString
		return
	}

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

func setCommandOption(v reflect.Value, o *discordgo.ApplicationCommandInteractionDataOption, r *discordgo.ApplicationCommandInteractionDataResolved) {
	switch o.Type {
	case discordgo.ApplicationCommandOptionString:
		v.SetString(o.Value.(string))
	case discordgo.ApplicationCommandOptionInteger:
		v.SetInt(int64(o.Value.(float64)))
	case discordgo.ApplicationCommandOptionBoolean:
		v.SetBool(o.Value.(bool))
	case discordgo.ApplicationCommandOptionNumber:
		v.SetFloat(o.Value.(float64))
	case discordgo.ApplicationCommandOptionUser:
		v.Set(reflect.ValueOf(r.Members[o.Value.(string)]))
	case discordgo.ApplicationCommandOptionChannel:
		v.Set(reflect.ValueOf(r.Channels[o.Value.(string)]))
	case discordgo.ApplicationCommandOptionRole:
		v.Set(reflect.ValueOf(r.Roles[o.Value.(string)]))
	case discordgo.ApplicationCommandOptionMentionable:
		v.Set(reflect.ValueOf(&Mentionable{
			id:              o.Value.(string),
			resolvedUsers:   r.Users,
			resolvedMembers: r.Members,
			resolvedRoles:   r.Roles,
		}))
	case discordgo.ApplicationCommandOptionAttachment:
		v.Set(reflect.ValueOf(r.Attachments[o.Value.(string)]))
	}

	panic("No idea what I am suppose to do with that type: " + o.Name)
}

func resolveOptionMinValue(t reflect.StructField, optionType discordgo.ApplicationCommandOptionType) *float64 {
	if optionType == discordgo.ApplicationCommandOptionInteger || optionType == discordgo.ApplicationCommandOptionNumber {
		if min, err := strconv.ParseFloat(t.Tag.Get("min"), 64); err != nil {
			return &min
		}
	}

	return nil
}

func resolveOptionMaxValue(t reflect.StructField, optionType discordgo.ApplicationCommandOptionType) float64 {
	if optionType == discordgo.ApplicationCommandOptionInteger || optionType == discordgo.ApplicationCommandOptionNumber {
		if max, err := strconv.ParseFloat(t.Tag.Get("max"), 64); err != nil {
			return max
		}
	}

	return 0
}

func resolveOptionMinLength(t reflect.StructField, optionType discordgo.ApplicationCommandOptionType) *int {
	if optionType == discordgo.ApplicationCommandOptionString {
		if min, err := strconv.Atoi(t.Tag.Get("min")); err != nil {
			return &min
		}
	}

	return nil
}

func resolveOptionMaxLength(t reflect.StructField, optionType discordgo.ApplicationCommandOptionType) int {
	if optionType == discordgo.ApplicationCommandOptionString {
		if max, err := strconv.Atoi(t.Tag.Get("max")); err != nil {
			return max
		}
	}

	return 0
}

func resolveOptionChoices(t reflect.StructField) []*discordgo.ApplicationCommandOptionChoice {
	if t.Type.Implements(reflect.TypeOf((*choiceParam)(nil)).Elem()) {
		gen, _ := t.Type.MethodByName("Choices")

		return gen.Func.Call(nil)[0].Interface().([]*discordgo.ApplicationCommandOptionChoice)
	}

	return nil
}
