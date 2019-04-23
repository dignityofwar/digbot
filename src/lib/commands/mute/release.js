const Command = require('../foundation/command');

module.exports = class ReleaseCommand extends Command {
    constructor({ moderatorsMutemoderator }) {
        super();

        this.name = 'mute:release';

        // this.throttle = {
        //     attempts: 2,
        //     decay: 5,
        // };

        this.mutemoderator = moderatorsMutemoderator;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        await Promise.all(request.message.mentions.members.map(m => this.mutemoderator.unmuteGuildMember(m)));

        return request.respond(
            `${request.message.mentions.members.length} member(s) have been released form the supermute role`,
        );
    }

    /**
     * @return {string}
     */
    help() {
        return 'Release users form their supermute role.';
    }
};
