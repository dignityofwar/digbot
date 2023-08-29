package interactor

import "github.com/bwmarrin/discordgo"

type Context struct {
	Session     *discordgo.Session
	Interaction *discordgo.Interaction
}

func (c *Context) Respond(resp *discordgo.InteractionResponse) error {
	return c.Session.InteractionRespond(c.Interaction, resp)
}

func (c *Context) UpsertRespond(data *discordgo.InteractionResponseData) error {
	if c.Interaction.Message == nil {
		return c.Session.InteractionRespond(c.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: data,
		})
	} else {
		return c.Session.InteractionRespond(c.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: data,
		})
	}
}

func (c *Context) ModalRespond(modal *Modal) error {
	return c.Session.InteractionRespond(c.Interaction, MakeModal(modal))
}
