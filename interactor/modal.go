package interactor

import (
	"errors"
	"github.com/bwmarrin/discordgo"
	"log"
)

var modalHandlers = make(map[string]*modalDescriptor)

func RegisterModal(options *ModalOptions) error {
	if _, found := modalHandlers[options.ModalID]; found {
		return errors.New("modalID is already registered")
	}

	if modal, err := options.convert(); err == nil {
		modalHandlers[options.ModalID] = modal
	} else {
		return err
	}

	log.Println("Registered modal: " + options.ModalID)

	return nil
}

func RegisterModals(options ...*ModalOptions) error {
	for _, option := range options {
		if err := RegisterModal(option); err != nil {
			return err
		}
	}

	return nil
}

func MakeModal(modal *Modal) *discordgo.InteractionResponse {
	return modalHandlers[modal.ModalID].make(modal)
}
