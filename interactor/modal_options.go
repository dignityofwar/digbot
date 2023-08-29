package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"reflect"
)

type ModalOptions struct {
	ModalID  string
	Title    string
	Callback any
}

func (o *ModalOptions) convert() (modal *modalDescriptor, err error) {
	callbackValue := reflect.ValueOf(o.Callback)
	callbackType := callbackValue.Type()

	fields := reflect.VisibleFields(callbackType.In(1).Elem())

	modal = &modalDescriptor{
		Title:         o.Title,
		Callback:      callbackValue,
		ParamFieldMap: make(map[string]modalParamField, len(fields)),
	}

	for _, field := range fields {
		if field.Anonymous {
			continue
		} else if field.Type.Kind() != reflect.String {
			err = errors.New("")
			return
		}

		modal.ParamFieldMap[field.Name] = modalParamField{
			ComponentPrototype: discordgo.TextInput{
				CustomID:    field.Name,
				Label:       field.Name,               // TODO: Infer from tag
				Style:       discordgo.TextInputShort, // TODO: Infer from tag
				Placeholder: field.Tag.Get("placeholder"),
				Required:    field.Tag.Get("required") == "true",
				//MinLength:   0,
				//MaxLength:   0,
			},
		}
	}

	return
}

type Modal struct {
	ModalID string
	ID      string
	Title   string
	Values  any
}

func (m Modal) customID() string {
	return m.ModalID + idDelimiter + m.ID
}
