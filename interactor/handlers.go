package interactor

import (
	"github.com/bwmarrin/discordgo"
	"strings"
)

func interactionHandler(s *discordgo.Session, i *discordgo.InteractionCreate) {
	context := Context{
		Session:     s,
		Interaction: i.Interaction,
	}

	switch i.Type {
	case discordgo.InteractionApplicationCommand:
		data := i.ApplicationCommandData()

		if command, ok := commandHandlers[data.Name]; ok {
			ctx := &CommandContext{
				Context: context,
				Data:    &data,
			}

			if err := command.execute(ctx, data.Options); err != nil {
				println(err.Error())

				if err := ctx.Respond(&discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Embeds: []*discordgo.MessageEmbed{
							{
								Description: "Something went wrong",
								Color:       ColorError,
							},
						},
						Flags: discordgo.MessageFlagsEphemeral,
					},
				}); err != nil {
					panic(err)
				}
			}
		} else {
			if err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						{
							Description: "Command not found",
							Color:       ColorError,
						},
					},
					Flags: discordgo.MessageFlagsEphemeral,
				},
			}); err != nil {
				panic(err)
			}
		}

		///
	case discordgo.InteractionMessageComponent:
		data := i.MessageComponentData()
		componentID, id := splitCustomID(data.CustomID)

		if cmp, ok := messageComponentHandlers[componentID]; ok {
			ctx := &MessageComponentContext{
				Context: context,
				Data:    &data,
				ID:      id,
			}

			if err := cmp.handle(ctx); err != nil {
				println(err.Error())

				if err := ctx.Respond(&discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Embeds: []*discordgo.MessageEmbed{
							{
								Description: "Something went wrong",
								Color:       ColorError,
							},
						},
						Flags: discordgo.MessageFlagsEphemeral,
					},
				}); err != nil {
					panic(err)
				}
			}
		} else {
			if err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "Something went wrong",
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			}); err != nil {
				panic(err)
			}
		}

	//case discordgo.InteractionApplicationCommandAutocomplete:
	// TODO: Support autocomplete
	case discordgo.InteractionModalSubmit:
		data := i.ModalSubmitData()
		componentID, id := splitCustomID(data.CustomID)

		if modal, ok := modalHandlers[componentID]; ok {
			ctx := &ModalContext{
				Context: context,
				Data:    &data,
				ID:      id,
			}

			if err := modal.handle(ctx); err != nil {
				println(err.Error())

				if err := ctx.Respond(&discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Embeds: []*discordgo.MessageEmbed{
							{
								Description: "Something went wrong",
								Color:       ColorError,
							},
						},
						Flags: discordgo.MessageFlagsEphemeral,
					},
				}); err != nil {
					panic(err)
				}
			}
		} else {
			if err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "Something went wrong",
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			}); err != nil {
				panic(err)
			}
		}
	}
}

func splitCustomID(customID string) (string, string) {
	pieces := strings.SplitN(customID, idDelimiter, 2)

	return pieces[0], pieces[1]
}
