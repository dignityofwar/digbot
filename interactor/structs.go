package interactor

import "github.com/bwmarrin/discordgo"

type Mentionable struct {
	id              string
	resolvedUsers   map[string]*discordgo.User
	resolvedMembers map[string]*discordgo.Member
	resolvedRoles   map[string]*discordgo.Role
}

func (m *Mentionable) User() (*discordgo.User, bool) {
	user, ok := m.resolvedUsers[m.id]
	return user, ok
}

func (m *Mentionable) Member() (*discordgo.Member, bool) {
	member, ok := m.resolvedMembers[m.id]
	return member, ok
}

func (m *Mentionable) Role() (*discordgo.Role, bool) {
	role, ok := m.resolvedRoles[m.id]
	return role, ok
}
