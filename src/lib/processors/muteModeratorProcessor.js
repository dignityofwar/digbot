const config = require('config');

module.exports = class MuteModeratorProcessor {
    constructor({ discordjsClient }) {
        this.client = discordjsClient;
    }

    /**
     * @param guild
     * @param user
     * @return {Promise<boolean>}
     */
    async processor({ data: { guild, user } }) {
        await this.client.guilds.get(guild).members.find(({ user: { id } }) => id === user)
            .removeRole(config.get(`guilds.${guild}.supermuteRole`));

        return true;
    }
};
