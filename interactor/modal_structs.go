package interactor

import (
	"github.com/bwmarrin/discordgo"
	"reflect"
)

type ModalContext struct {
	Context
	Data *discordgo.ModalSubmitInteractionData
	ID   string
}

type modalDescriptor struct {
	Title         string
	Callback      reflect.Value
	ParamFieldMap map[string]modalParamField
}

func (m *modalDescriptor) handle(ctx *ModalContext) error {
	paramsValue := reflect.New(m.Callback.Type().In(1).Elem())

	for _, component := range ctx.Data.Components {
		input := component.(*discordgo.ActionsRow).Components[0].(*discordgo.TextInput)

		paramsValue.Elem().FieldByName(input.CustomID).SetString(input.Value)
	}

	args := []reflect.Value{reflect.ValueOf(ctx), paramsValue}

	if err := captureError(m.Callback.Call(args)); err != nil {
		return err
	}

	return nil
}

func (m *modalDescriptor) make(modal *Modal) *discordgo.InteractionResponse {
	components := make([]discordgo.MessageComponent, 0, len(m.ParamFieldMap))
	values := reflect.ValueOf(modal.Values)
	hasValues := values.Kind() == reflect.Struct

	for fieldName, field := range m.ParamFieldMap {
		value := ""
		if hasValues {
			value = values.FieldByName(fieldName).String()
		}

		components = append(components, discordgo.ActionsRow{
			Components: []discordgo.MessageComponent{field.make(value)},
		})
	}

	return &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseModal,
		Data: &discordgo.InteractionResponseData{
			CustomID:   modal.customID(),
			Title:      modal.Title,
			Components: components,
		},
	}
}

type modalParamField struct {
	ComponentPrototype discordgo.TextInput
}

func (f *modalParamField) make(value string) discordgo.TextInput {
	input := f.ComponentPrototype

	input.Value = value

	return input
}
