package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
)

type MessageComponent interface {
	compileMessageComponent() (*messageComponentDescriptor, error)
}

//
//
//

type ButtonOptions struct {
	ComponentID string
	Callback    any

	Label string
	Style discordgo.ButtonStyle
	Emoji discordgo.ComponentEmoji
}

func (o *ButtonOptions) compileMessageComponent() (cmp *messageComponentDescriptor, err error) {
	callbackValue := reflect.ValueOf(o.Callback)
	callbackType := callbackValue.Type()

	if callbackValue.Kind() != reflect.Func {
		err = errors.New("callback needs to be of kind func")
		return
	} else if callbackType.NumIn() > 1 {
		err = errors.New("too many arguments")
		return
	} else if callbackType.NumIn() < 1 || callbackType.In(0) != reflect.TypeOf((*MessageComponentContext)(nil)) {
		err = errors.New("first argument need to be an a pointer to the component context")
		return
	}

	cmp = &messageComponentDescriptor{
		ComponentGenerator: func(cmp *MessageComponentOptions) discordgo.MessageComponent {
			return discordgo.Button{
				CustomID: cmp.customID(),
				Disabled: cmp.Disabled,
				Label:    o.Label,
				Style:    o.Style,
				Emoji:    o.Emoji,
			}
		},
		Callback: callbackValue,
	}

	return
}

//
//
//

type SelectMenuOptions struct {
	ComponentID string
	Callback    any

	Placeholder  string
	MinValues    *int
	MaxValues    int
	Options      []discordgo.SelectMenuOption
	ChannelTypes []discordgo.ChannelType
}

func (o *SelectMenuOptions) compileMessageComponent() (cmp *messageComponentDescriptor, err error) {
	callbackValue := reflect.ValueOf(o.Callback)
	callbackType := callbackValue.Type()

	componentType, err := o.resolveType(callbackType.In(1).Elem())
	if err != nil {
		return
	}

	cmp = &messageComponentDescriptor{
		ComponentGenerator: func(cmp *MessageComponentOptions) discordgo.MessageComponent {
			return discordgo.SelectMenu{
				MenuType:     componentType,
				CustomID:     cmp.customID(),
				Disabled:     cmp.Disabled,
				Placeholder:  o.Placeholder,
				MinValues:    o.MinValues,
				MaxValues:    o.MaxValues,
				Options:      o.Options,
				ChannelTypes: o.ChannelTypes,
			}
		},
		Callback: callbackValue,
	}

	return
}

func (o *SelectMenuOptions) resolveType(i reflect.Type) (discordgo.SelectMenuType, error) {
	switch i {
	case reflect.TypeOf(""):
		return discordgo.StringSelectMenu, nil
	case reflect.TypeOf((*discordgo.User)(nil)):
		return discordgo.UserSelectMenu, nil
	case reflect.TypeOf((*discordgo.Role)(nil)):
		return discordgo.RoleSelectMenu, nil
	case reflect.TypeOf(Mentionable{}):
		return discordgo.MentionableSelectMenu, nil
	case reflect.TypeOf((*discordgo.Channel)(nil)):
		return discordgo.ChannelSelectMenu, nil
	}

	return 0, errors.New("")
}

//
//
//

type MessageComponentOptions struct {
	ComponentID string
	ID          string
	Disabled    bool
}

func (o MessageComponentOptions) customID() string {
	return o.ComponentID + idDelimiter + o.ID
}
