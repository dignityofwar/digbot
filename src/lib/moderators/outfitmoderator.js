const { get } = require('lodash');
const EventEmitter = require('events');
const config = require('config');
const HasClaim = require('./exceptions/hasclaim');
const CharacterNotFound = require('./exceptions/playernotfound');
const NotInOutfit = require('./exceptions/notinoutfit');
const ProtectedRank = require('./exceptions/protectedrank');
const CharacterClaim = require('../database/characterclaim');
const Claimed = require('./exceptions/claimed');

module.exports = class OutfitModerator extends EventEmitter {
    constructor({ apisPs2 }) {
        super();

        this.api = apisPs2;
    }

    /**
     * @param member
     * @param name
     * @return {Promise<*>}
     */
    async makeClaim(member, name) {
        if (await this.hasClaim(member)) {
            throw new HasClaim(member);
        }

        return this.revalidateClaim(member, name);
    }

    /**
     * @param member
     * @param name
     * @return {Promise<*>}
     */
    async revalidateClaim(member, name) {
        const character = await this.api.getCharacterByName(name, { resolve: 'outfit_member' });

        if (!character) {
            await this.unClaim(member);

            throw new CharacterNotFound(member, name);
        }

        this.filter(member, character);

        if (await this.isClaimed(member.guild, character)) {
            throw new Claimed(member, character, await this.getClaim(member.guild, character));
        }

        return this.claim(member, character);
    }

    /**
     * @param member
     * @param name
     * @return {Promise<void>}
     */
    async forceClaim(member, name) {
        const character = await this.api.getCharacterByName(name, { resolve: 'outfit_member' });

        if (!character) {
            await this.unClaim(member);

            throw new CharacterNotFound(member, name);
        }

        this.filter(member, character);

        return {
            unclaimed: await this.unClaim(member.guild, character),
            claimed: await this.claim(member, character),
        };
    }

    /**
     * @param member
     * @param character
     */
    filter(member, character) {
        if (
            config.has(`guilds.${member.guild.id}.ps2CharacterClaimer.outfit`)
            && get(character, 'outfit_member.outfit_id')
            !== config.get(`guilds.${member.guild.id}.ps2CharacterClaimer.outfit`)
        ) {
            throw new NotInOutfit(member, character);
        }

        if (
            config.get(`guilds.${member.guild.id}.ps2CharacterClaimer.filterRank`)
            && config.get(`guilds.${member.guild.id}.ps2CharacterClaimer.filterRank`)
                .includes(get(character, 'outfit_member.rank'))
        ) {
            throw new ProtectedRank(member, character);
        }
    }

    /**
     * @param guild
     * @param character
     * @return {*}
     */
    isClaimed(guild, character) {
        return CharacterClaim.exists({
            guild: guild.id,
            character: character.character_id,
        });
    }

    /**
     * @param guild
     * @param character
     */
    getClaim(guild, character) {
        return CharacterClaim.findOne({
            guild: guild.id,
            character: character.character_id,
        });
    }

    /**
     * @param member
     * @return {*}
     */
    hasClaim(member) {
        return CharacterClaim.exists({
            guild: member.guild.id,
            member: member.id,
            character: { $ne: null },
        });
    }

    /**
     * @param member
     * @param character
     * @return {Promise}
     */
    claim(member, character) {
        return CharacterClaim.findOneAndUpdate({
            guild: member.guild.id,
            member: member.id,
        }, {
            character: character.character_id,
            name: character.name.first,
            claims: {
                $push: {
                    character: character.character_id,
                    name: character.name.first,
                    at: Date.now(),
                },
            },
        }, {
            new: true,
            upsert: true,
        })
            .exec();
    }

    /**
     * @param guild
     * @param character
     * @return {Promise}
     */
    unClaim(guild, character) {
        return CharacterClaim.findOneAndUpdate({
            guild: guild.id,
            character: character.character_id,
        }, {
            character: null,
            name: null,
        })
            .exec();
    }
};
