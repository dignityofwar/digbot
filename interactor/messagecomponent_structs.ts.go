package interactor

import (
	"fmt"
	"github.com/bwmarrin/discordgo"
	"reflect"
)

type MessageComponentContext struct {
	Context
	Data *discordgo.MessageComponentInteractionData
	ID   string
}

type messageComponentDescriptor struct {
	Callback           reflect.Value
	ComponentGenerator func(cmp *MessageComponentOptions) discordgo.MessageComponent
}

func (c *messageComponentDescriptor) handle(ctx *MessageComponentContext) error {
	args := []reflect.Value{reflect.ValueOf(ctx)}

	if ctx.Data.Values != nil {
		value, err := c.resolveValues(ctx)
		if err != nil {
			return err
		}

		args = append(args, value)
	}

	if err := captureError(c.Callback.Call(args)); err != nil {
		return err
	}

	return nil
}

func (c *messageComponentDescriptor) resolveValues(ctx *MessageComponentContext) (reflect.Value, error) {
	switch ctx.Data.ComponentType {
	//case discordgo.ActionsRowComponent:
	//case discordgo.ButtonComponent:
	case discordgo.SelectMenuComponent:
		return reflect.ValueOf(ctx.Data.Values), nil
	//case discordgo.TextInputComponent:
	case discordgo.UserSelectMenuComponent:
		return reflect.ValueOf(mapToArray(ctx.Data.Resolved.Users)), nil
	case discordgo.RoleSelectMenuComponent:
		return reflect.ValueOf(mapToArray(ctx.Data.Resolved.Roles)), nil
	case discordgo.MentionableSelectMenuComponent:
		return reflect.ValueOf([]Mentionable{}), nil
	case discordgo.ChannelSelectMenuComponent:
		return reflect.ValueOf(mapToArray(ctx.Data.Resolved.Channels)), nil
	}

	return reflect.Value{}, fmt.Errorf("unable to resolveValue values due to unsupported component type %d", ctx.Data.ComponentType)
}
