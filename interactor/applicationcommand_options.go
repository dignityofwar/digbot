package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
	"strings"
)

type CommandPermissions struct {
	DefaultMemberPermissions *int64
	DMPermission             *bool
	NSFW                     *bool
}

type Command interface {
	compileCommand(perms *CommandPermissions) (*discordgo.ApplicationCommand, commandExecuteDescriptor, error)
}

type CommandOptions interface {
	compileOption() (*discordgo.ApplicationCommandOption, commandExecuteDescriptor, error)
}

//
//
//

type MemberCommand struct {
	Name              string
	NameLocalizations *map[discordgo.Locale]string
	Callback          any
}

func (c *MemberCommand) compileCommand(perms *CommandPermissions) (*discordgo.ApplicationCommand, commandExecuteDescriptor, error) {
	cmd := &discordgo.ApplicationCommand{
		Type:                     discordgo.UserApplicationCommand,
		Name:                     c.Name,
		NameLocalizations:        c.NameLocalizations,
		DefaultMemberPermissions: perms.DefaultMemberPermissions,
		DMPermission:             perms.DMPermission,
		NSFW:                     perms.NSFW,
	}

	callbackValue := reflect.ValueOf(c.Callback)
	paramType := callbackValue.Type().In(1)
	desc := &commandDescriptor{
		Callback: callbackValue,
	}

	if paramType == reflect.TypeOf((*discordgo.Member)(nil)) {
		desc.ParamGenerator = func(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) reflect.Value {
			for _, value := range ctx.Data.Resolved.Members {
				return reflect.ValueOf(value)
			}
			panic("uuuggggghhhhhh")
		}
	} else if paramType == reflect.TypeOf((*discordgo.User)(nil)) {
		desc.ParamGenerator = func(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) reflect.Value {
			for _, value := range ctx.Data.Resolved.Users {
				return reflect.ValueOf(value)
			}
			panic("uuuugggghhhhhhhhhhh")
		}
	} else {
		return nil, nil, errors.New("invalid second parameter for function")
	}

	return cmd, desc, nil
}

//
//
//

type MessageCommand struct {
	Name              string
	NameLocalizations *map[discordgo.Locale]string
	Callback          any
}

func (c *MessageCommand) compileCommand(perms *CommandPermissions) (*discordgo.ApplicationCommand, commandExecuteDescriptor, error) {
	cmd := &discordgo.ApplicationCommand{
		Type:                     discordgo.MessageApplicationCommand,
		Name:                     c.Name,
		NameLocalizations:        c.NameLocalizations,
		DefaultMemberPermissions: perms.DefaultMemberPermissions,
		DMPermission:             perms.DMPermission,
		NSFW:                     perms.NSFW,
	}

	callbackValue := reflect.ValueOf(c.Callback)
	desc := &commandDescriptor{
		Callback: callbackValue,
		ParamGenerator: func(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) reflect.Value {
			for _, value := range ctx.Data.Resolved.Messages {
				return reflect.ValueOf(value)
			}
			panic("uggghhhh")
		},
	}

	return cmd, desc, nil
}

//
//
//

type SlashCommand struct {
	Name                     string
	NameLocalizations        *map[discordgo.Locale]string
	Description              string
	DescriptionLocalizations *map[discordgo.Locale]string
	Callback                 any
}

func (c *SlashCommand) compileCommand(perms *CommandPermissions) (*discordgo.ApplicationCommand, commandExecuteDescriptor, error) {
	option, desc, err := c.compileOption()

	if err != nil {
		return nil, nil, err
	}

	cmd := &discordgo.ApplicationCommand{
		Type:                     discordgo.ChatApplicationCommand,
		Name:                     option.Name,
		NameLocalizations:        c.NameLocalizations,
		Description:              option.Description,
		DescriptionLocalizations: c.DescriptionLocalizations,
		DefaultMemberPermissions: perms.DefaultMemberPermissions,
		DMPermission:             perms.DMPermission,
		NSFW:                     perms.NSFW,
	}

	return cmd, desc, nil
}

func (c *SlashCommand) compileOption() (*discordgo.ApplicationCommandOption, commandExecuteDescriptor, error) {
	option := &discordgo.ApplicationCommandOption{
		Type:        discordgo.ApplicationCommandOptionSubCommand,
		Name:        c.Name,
		Description: c.Description,
	}

	callbackValue := reflect.ValueOf(c.Callback)
	desc := &commandDescriptor{
		Callback: callbackValue,
	}

	if callbackType := callbackValue.Type(); callbackType.NumIn() > 1 {
		var err error
		option.Options, desc.ParamGenerator, err = c.inferParams(callbackType.In(1).Elem())

		if err != nil {
			return nil, nil, err
		}
	}

	return option, desc, nil
}

func (c *SlashCommand) inferParams(param reflect.Type) (options []*discordgo.ApplicationCommandOption, gen commandParamGenerator, err error) {
	nameToFieldMap := make(map[string][]int)

	for _, field := range reflect.VisibleFields(param) {
		if field.Anonymous {
			continue
		}

		option, errField := c.inferFieldOption(field)
		err = errField
		if err != nil {
			return
		}

		options = append(options, option)
		nameToFieldMap[option.Name] = field.Index
	}

	gen = func(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) (value reflect.Value) {
		value = reflect.New(param)
		elemValue := value.Elem()

		for _, option := range options {
			setCommandOption(elemValue.FieldByIndex(nameToFieldMap[option.Name]), option, ctx.Data.Resolved)
		}

		return
	}

	return
}

func (c *SlashCommand) inferFieldOption(field reflect.StructField) (*discordgo.ApplicationCommandOption, error) {
	optionType, err := resolveCommandOptionType(field.Type)
	if err != nil {
		return nil, err
	}

	option := &discordgo.ApplicationCommandOption{
		Type:                     optionType,
		Name:                     strings.ToLower(field.Name),
		NameLocalizations:        nil,
		Description:              field.Tag.Get("description"),
		DescriptionLocalizations: nil,
		Required:                 field.Tag.Get("required") == "true",
		ChannelTypes:             resolveOptionsChannelTypes(field),
		Choices:                  resolveOptionChoices(field),
		MinValue:                 resolveOptionMinValue(field, optionType),
		MaxValue:                 resolveOptionMaxValue(field, optionType),
		MinLength:                resolveOptionMinLength(field, optionType),
		MaxLength:                resolveOptionMaxLength(field, optionType),
	}

	return option, err
}

//
//
//

type SlashCommandGroup struct {
	Name                     string
	NameLocalizations        *map[discordgo.Locale]string
	Description              string
	DescriptionLocalizations *map[discordgo.Locale]string
	SubCommands              []CommandOptions
}

func (c *SlashCommandGroup) compileCommand(perms *CommandPermissions) (*discordgo.ApplicationCommand, commandExecuteDescriptor, error) {
	option, desc, err := c.compileOption()

	cmd := &discordgo.ApplicationCommand{
		Type:                     discordgo.ChatApplicationCommand,
		Name:                     option.Name,
		NameLocalizations:        c.NameLocalizations,
		Description:              option.Description,
		DescriptionLocalizations: c.DescriptionLocalizations,
		Options:                  option.Options,
		DefaultMemberPermissions: perms.DefaultMemberPermissions,
		DMPermission:             perms.DMPermission,
		NSFW:                     perms.NSFW,
	}

	return cmd, desc, err
}

func (c *SlashCommandGroup) compileOption() (*discordgo.ApplicationCommandOption, commandExecuteDescriptor, error) {
	options := make([]*discordgo.ApplicationCommandOption, len(c.SubCommands))
	subCommands := make(map[string]commandExecuteDescriptor, len(c.SubCommands))

	for i, sub := range c.SubCommands {
		option, subDesc, err := sub.compileOption()

		if err != nil {
			return nil, nil, err
		}

		options[i] = option
		subCommands[option.Name] = subDesc
	}

	option := &discordgo.ApplicationCommandOption{
		Type:        discordgo.ApplicationCommandOptionSubCommandGroup,
		Name:        c.Name,
		Description: c.Description,
		Options:     options,
	}

	desc := &commandGroupDescriptor{
		SubCommands: subCommands,
	}

	return option, desc, nil
}

//
//
//

type choiceParam interface {
	Choices() []*discordgo.ApplicationCommandOptionChoice
}
