const { get } = require('lodash');
const HasRole = require('./exceptions/hasrole');
const CharacterNotFound = require('./exceptions/playernotfound');
const NotInOutfit = require('./exceptions/notinoutfit');
const ProtectedRank = require('./exceptions/protectedrank');
const CharacterClaim = require('../database/characterclaim');
const Claimed = require('./exceptions/claimed');

const server = require('../server/server'); // TODO: Remove this

// TODO: Investigate cases when not to remove the role

module.exports = class OutfitModerator {
    constructor({ apisPs2 }) {
        this.api = apisPs2;
    }

    async claim(member, name, checker) {
        if (!checker.revalidate && member.roles.has(checker.role)) {
            throw new HasRole(member, name, checker);
        }

        const character = this.api.getCharacterByName(name, { resolve: 'outfit_member' });
        const staff = server.getChannel('staff');

        this.filter(member, name, character, checker, staff);

        const res = await this.checkDB(member, name, character, checker);

        this.notifyStaffWhenAppropriate(member, res, staff, checker, character);

        await member.addRole(checker.role, `Role claimed, character name ${get(character, 'name.first')}`);

        return {
            member,
            name,
            checker,
            character,
        };
    }

    filter(member, name, character, checker, staff) {
        if (!character) {
            throw new CharacterNotFound(member, name, checker);
        }

        if (get(character, 'outfit_member.outfit_id') !== checker.outfit) {
            throw new NotInOutfit(member, name, checker, character);
        }

        if (checker.filter.includes(get(character, 'outfit_member.rank'))) {
            if (checker.warnRank) {
                staff.send(`${member} tried to claim the ps2 character '${get(character,
                    'name.first')}' that has a protected rank.`);
            }

            throw new ProtectedRank(member, name, checker, character);
        }
    }

    notifyStaffWhenAppropriate(member, res, staff, checker, character) {
        const charName = get(character, 'name.first');

        if (checker.warnUnclaimed && res.unclaimed) {
            staff.send(`${member} switched their ps2 character claim from `
                + `${res.unclaimed.claims.pop().name}(${res.unclaimed.character}) to `
                + `${charName}(${get(character, 'character_id')}).`);
        }

        if (checker.warnReclaimed && res.claimed.claims.length > 1) {
            const claims = res.claimed.claims
                .map(c => c.member)
                .filter((m, i, s) => s.indexOf(m) === i && m !== member.id);

            if (claims.length > 0) { // Claimed multiple times
                staff.send(`${member} has claimed the ps2 character '${charName}' `
                    + `that was claimed before by others. Last claimer by id: ${claims.pop()}`);
            }
        }
    }

    /**
     * @param member
     * @param name
     * @param character
     * @param checker
     * @return {Promise<boolean>} true if
     */
    async checkDB(member, name, character, checker) {
        const charID = get(character, 'character_id');
        const charName = get(character, 'name.first');

        if (
            await CharacterClaim.exists({
                guild: member.guild.id,
                character: charID,
                member: { $ne: member.id },
                claimed: true,
            })
                .exec()
        ) {
            throw new Claimed(member, charName, checker, character);
        }

        const [unclaimed, claimed] = await Promise.all([
            CharacterClaim.findOneAndUpdate({
                guild: member.guild.id,
                member: member.id,
                character: { $ne: charID }, // Prevent race-condition
            }, {
                member: null,
                claimed: false,
            }, {
                new: true,
            }),

            CharacterClaim.findOneAndUpdate({
                guild: member.guild.id,
                character: charID,
            }, {
                member: member.id,
                claimed: true,
                claims: {
                    $push: {
                        member: member.id,
                        at: Date.now(),
                        name: charName,
                    },
                },
            }, {
                new: true,
                upsert: true,
            }),
        ]);

        return {
            unclaimed,
            claimed,
        };
    }
};
