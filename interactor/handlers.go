package interactor

import (
	"encoding/json"
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

		data.Type()

		fleep, _ := json.MarshalIndent(data, "", "  ")
		println(string(fleep))

		if command, ok := commandHandlers[data.Name]; ok {
			ctx := &CommandContext{
				Context: context,
				Data:    &data,
			}

			if err := command.execute(ctx, data.Options); err != nil {
				println(err.Error())

				ctx.Respond(&discordgo.InteractionResponse{
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
				})
			}
		} else {
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
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
			})
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

				ctx.Respond(&discordgo.InteractionResponse{
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
				})
			}
		} else {
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "Something went wrong",
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			})
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

				ctx.Respond(&discordgo.InteractionResponse{
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
				})
			}
		} else {
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "Something went wrong",
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			})
		}
	}
}

func splitCustomID(customID string) (string, string) {
	pieces := strings.SplitN(customID, idDelimiter, 2)

	return pieces[0], pieces[1]
}
