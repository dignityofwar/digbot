const { words } = require('lodash');
const moment = require('moment');
const Command = require('./foundation/command');

const GamePresence = require('../database/gamepresence');

module.exports = class ReportCommand extends Command {
    /**
     *
     */
    constructor() {
        super();

        this.name = 'report';
        this.special = true;

        this.throttle = {
            attempts: 2,
            decay: 15,
            peruser: false,
        };
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        const timeFrame = this.wantsWeek(request.content) ? ['week', 'w'] : ['month', 'M'];

        const start = moment().subtract(1, timeFrame[1]).startOf(timeFrame[0]);
        const end = moment().subtract(1, timeFrame[1]).endOf(timeFrame[0]);

        const result = await GamePresence.aggregate([
            {
                $match: {
                    guild: request.guild.id,
                    start: { $lte: end.toDate() },
                    $or: [
                        { end: { $gte: start.toDate() } },
                        { end: null },
                    ],
                },
            },
            {
                $group: {
                    _id: '$game',
                    members: { $addToSet: '$member' },
                },
            },
            {
                $unwind: '$members',
            },
            {
                $group: {
                    _id: '$_id',
                    memberCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    game: '$_id',
                    memberCount: 1,
                },
            },
        ]);

        await request.member.send(result.reduce(
            (acc, { game, memberCount }) => `${acc}\n${game}: ${memberCount}`,
            `Report\n${start.format('ll')}-${end.format('ll')}\n`,
        ));

        await request.respond('I send you a PM');
    }

    /**
     * @param content
     * @return {boolean}
     */
    wantsWeek(content) {
        return (words(content).find((e, i) => i > 0 && e) || '').toUpperCase() === 'WEEK';
    }

    /**
     * @return {string}
     */
    help() {
        return 'Generates a report and send it as a PM(last month). !report week give a report for last week.';
    }
};
