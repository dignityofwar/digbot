package interactor

import (
	"github.com/bwmarrin/discordgo"
	"log"
)

var messageComponentHandlers = make(map[string]*messageComponentDescriptor)

func RegisterButtonComponent(opt *ButtonOptions) error {
	if cmp, err := opt.convert(); err == nil {
		messageComponentHandlers[opt.ComponentID] = cmp
	} else {
		return err
	}

	log.Println("Registered button component: " + opt.ComponentID)

	return nil
}

func RegisterSelectorComponent(opt *SelectMenuOptions) error {
	if cmp, err := opt.convert(); err == nil {
		messageComponentHandlers[opt.ComponentID] = cmp

		return nil
	} else {
		return err
	}
}

func MakeMessageComponent(cmp *MessageComponentOptions) discordgo.MessageComponent {
	return messageComponentHandlers[cmp.ComponentID].ComponentGenerator(cmp)
}
