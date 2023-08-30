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

func RegisterButtonComponents(opts ...*ButtonOptions) error {
	for _, opt := range opts {
		if err := RegisterButtonComponent(opt); err != nil {
			return err
		}
	}

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

func RegisterSelectorComponents(opts ...*SelectMenuOptions) error {
	for _, opt := range opts {
		if err := RegisterSelectorComponent(opt); err != nil {
			return err
		}
	}

	return nil
}

func MakeMessageComponent(cmp *MessageComponentOptions) discordgo.MessageComponent {
	return messageComponentHandlers[cmp.ComponentID].ComponentGenerator(cmp)
}
