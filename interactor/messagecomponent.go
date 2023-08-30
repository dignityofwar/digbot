package interactor

import (
	"github.com/bwmarrin/discordgo"
	"log"
	"reflect"
)

// TODO: components per type questionmark?
var messageComponentHandlers = make(map[string]*messageComponentDescriptor)

func RegisterMessageComponent(cmp MessageComponent) error {
	cmpValue := reflect.ValueOf(cmp).Elem()
	cmpID := cmpValue.FieldByName("ComponentID").String()

	if desc, err := cmp.compileMessageComponent(); err == nil {
		messageComponentHandlers[cmpID] = desc
	} else {
		return err
	}

	log.Println("Registered component: " + cmpID)

	return nil
}

func RegisterMessageComponents(cmps ...MessageComponent) error {
	for _, cmp := range cmps {
		if err := RegisterMessageComponent(cmp); err != nil {
			return err
		}
	}

	return nil
}

func MakeMessageComponent(cmp *MessageComponentOptions) discordgo.MessageComponent {
	return messageComponentHandlers[cmp.ComponentID].ComponentGenerator(cmp)
}
