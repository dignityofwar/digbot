package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
)

type CommandContext struct {
	Context
	Data *discordgo.ApplicationCommandInteractionData
}

type commandExecuteDescriptor interface {
	execute(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) error
}

//
//
//

type versionedCommandDescriptor struct {
	commandDescriptor
	Version int
}

func (d *versionedCommandDescriptor) execute(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) error {
	if d.Version != ctx.Interaction.Version {
		return errors.New("command version mismatch")
	}

	return d.commandDescriptor.execute(ctx, options)
}

//
//
//

type commandParamGenerator func(*CommandContext, []*discordgo.ApplicationCommandInteractionDataOption) reflect.Value

type commandDescriptor struct {
	Callback       reflect.Value
	ParamGenerator commandParamGenerator
}

func (d *commandDescriptor) execute(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) error {
	args := []reflect.Value{
		reflect.ValueOf(ctx),
	}
	if d.ParamGenerator != nil {
		args = append(args, d.ParamGenerator(ctx, options))
	}

	if err := captureError(d.Callback.Call(args)); err != nil {
		return err
	}

	return nil
}

//
//
//

type commandGroupDescriptor struct {
	SubCommands map[string]commandExecuteDescriptor
}

func (d *commandGroupDescriptor) execute(ctx *CommandContext, options []*discordgo.ApplicationCommandInteractionDataOption) error {
	return d.SubCommands[options[0].Name].execute(ctx, options[0].Options)
}
