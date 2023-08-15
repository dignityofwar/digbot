package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
	"strings"
)

type Mentionable struct {
	// TODO: Implement struct
}

type SlashCommandPermissions struct {
	DefaultMemberPermissions *int64
	DMPermission             *bool
	NSFW                     *bool
}

type SlashCommandOptions struct {
	Type        SlashCommandType
	Name        string
	Description string
	Callback    any
	Choices     map[string][]*discordgo.ApplicationCommandOptionChoice
	SubCommands []*SlashCommandOptions
}

func (o *SlashCommandOptions) build(perm *SlashCommandPermissions) (options *discordgo.ApplicationCommand, cmd *slashCommand, err error) {
	if perm == nil {
		perm = &SlashCommandPermissions{}
	}

	opt, cmd, err := o.convert()

	if err != nil {
		return
	}

	options = &discordgo.ApplicationCommand{
		Type:                     discordgo.ChatApplicationCommand,
		Name:                     opt.Name,
		Description:              opt.Description,
		Options:                  opt.Options,
		DefaultMemberPermissions: perm.DefaultMemberPermissions,
		DMPermission:             perm.DMPermission,
		NSFW:                     perm.NSFW,
	}

	return
}

func (o *SlashCommandOptions) convert() (options *discordgo.ApplicationCommandOption, cmd *slashCommand, err error) {
	switch o.Type {
	case SlashCommand:
		options = &discordgo.ApplicationCommandOption{
			Type:        discordgo.ApplicationCommandOptionSubCommand,
			Name:        o.Name,
			Description: o.Description,
		}

		cmd = &slashCommand{}

		options.Options, cmd.Callback, err = o.inferFromCallback()

		return
	case SlashCommandGroup:
		options = &discordgo.ApplicationCommandOption{
			Type:        discordgo.ApplicationCommandOptionSubCommandGroup,
			Name:        o.Name,
			Description: o.Description,
			Options:     make([]*discordgo.ApplicationCommandOption, len(o.SubCommands)),
		}

		cmd = &slashCommand{
			SubCommands: make(map[string]*slashCommand, len(o.SubCommands)),
		}

		for i, sub := range o.SubCommands {
			options.Options[i], cmd.SubCommands[sub.Name], err = sub.convert()

			if err != nil {
				return
			}
		}

		return
	}

	err = errors.New("unknown SlashCommandOptions type")

	return
}

func (o *SlashCommandOptions) inferFromCallback() (options []*discordgo.ApplicationCommandOption, cbDetails *slashCommandCallback, err error) {
	callbackValue := reflect.ValueOf(o.Callback)
	callbackType := callbackValue.Type()

	if callbackType.Kind() != reflect.Func {
		err = errors.New("callback needs to be of kind func")
		return
	} else if callbackType.NumIn() == 0 || callbackType.In(0) != reflect.TypeOf((*SlashCommandContext)(nil)) {
		err = errors.New("first argument need to be an a pointer to the command context")
		return
	} else if callbackType.NumIn() == 2 && (callbackType.In(1).Kind() != reflect.Pointer || callbackType.In(1).Elem().Kind() != reflect.Struct) {
		err = errors.New("second argument needs to be a pointer to a struct if requested")
		return
	} else if callbackType.NumIn() > 2 {
		err = errors.New("too many arguments")
		return
	}

	cbDetails = &slashCommandCallback{
		Value: &callbackValue,
	}

	if callbackType.NumIn() == 2 {
		paramStruct := callbackType.In(1).Elem()
		fields := reflect.VisibleFields(paramStruct)

		cbDetails.ParamStruct = &paramStruct
		cbDetails.ParamNameMap = make(map[string]*paramField, len(fields))

		options = make([]*discordgo.ApplicationCommandOption, 0, len(fields))

		for _, field := range fields {
			if field.Anonymous {
				continue
			}

			optionName := strings.ToLower(field.Name)
			optionType, ok := resolveOptionType(field.Type)

			if !ok {
				err = errors.New("invalid param field type, do not export field if you do not want to use it")
				return
			}

			cbDetails.ParamNameMap[optionName] = &paramField{
				Name: field.Name,
				Type: optionType,
			}

			options = append(options, &discordgo.ApplicationCommandOption{
				Name:         optionName,
				Description:  field.Tag.Get("description"),
				Type:         optionType,
				Required:     field.Tag.Get("required") == "true",
				ChannelTypes: resolveOptionsChannelTypes(field),
				Choices:      o.Choices[field.Name],
				//MinValue:     nil,
				//MaxValue:     0,
				//MinLength:    nil,
				//MaxLength:    0,
			})
		}
	}

	return
}

type SlashCommandContext struct {
	Session     *discordgo.Session
	Interaction *discordgo.Interaction
	Data        *discordgo.ApplicationCommandInteractionData
}

type slashCommand struct {
	Callback    *slashCommandCallback
	SubCommands map[string]*slashCommand
}

func (cmd *slashCommand) execute(ctx *SlashCommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) {
	if len(options) == 1 && (options[0].Type == discordgo.ApplicationCommandOptionSubCommandGroup || options[0].Type == discordgo.ApplicationCommandOptionSubCommand) {
		cmd.SubCommands[options[0].Name].execute(ctx, options[0].Options)
		return
	}

	if cmd.Callback.ParamStruct != nil {
		paramInstance := reflect.New(*cmd.Callback.ParamStruct)
		paramValue := paramInstance.Elem()

		for _, opt := range options {
			field := cmd.Callback.ParamNameMap[opt.Name]
			value := field.resolve(opt.Value, ctx.Data.Resolved)

			paramValue.FieldByName(field.Name).Set(value)
		}

		cmd.Callback.Value.Call([]reflect.Value{reflect.ValueOf(ctx), paramInstance})
	} else {
		cmd.Callback.Value.Call([]reflect.Value{reflect.ValueOf(ctx)})
	}
}

type slashCommandCallback struct {
	Value        *reflect.Value
	ParamStruct  *reflect.Type
	ParamNameMap map[string]*paramField
}

type paramField struct {
	Name string
	Type discordgo.ApplicationCommandOptionType
}

func (f *paramField) resolve(v any, r *discordgo.ApplicationCommandInteractionDataResolved) reflect.Value {
	switch f.Type {
	case discordgo.ApplicationCommandOptionString:
		return reflect.ValueOf(v)
	case discordgo.ApplicationCommandOptionInteger:
		return reflect.ValueOf(int64(v.(float64)))
	case discordgo.ApplicationCommandOptionBoolean:
		return reflect.ValueOf(v)
	case discordgo.ApplicationCommandOptionNumber:
		return reflect.ValueOf(v)
	case discordgo.ApplicationCommandOptionUser:
		return reflect.ValueOf(r.Users[v.(string)])
	case discordgo.ApplicationCommandOptionChannel:
		return reflect.ValueOf(r.Channels[v.(string)])
	case discordgo.ApplicationCommandOptionRole:
		return reflect.ValueOf(r.Roles[v.(string)])
	case discordgo.ApplicationCommandOptionMentionable:
		// TODO: Find actual value to assign
		return reflect.ValueOf(&Mentionable{})
	case discordgo.ApplicationCommandOptionAttachment:
		return reflect.ValueOf(r.Attachments[v.(string)])
	}

	println(f.Name, f.Type)
	panic("No idea what I am suppose to do with that type: " + f.Name)
}
