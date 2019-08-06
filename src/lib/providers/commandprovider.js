// const config = require('config');
const { asClass } = require('awilix');
const { isString } = require('lodash');
const ServiceProvider = require('../foundation/serviceprovider');

const CommandRegister = require('../commands/foundation/commandregister');

const play = require('../commands/play');
const sfx = require('../commands/sfx');


module.exports = class QueueProvider extends ServiceProvider {
    /**
     * TODO: Maybe register them in the config file?
     *
     * @return {({execute}|*)[]}
     */
    get commands() {
        return [
            'commandsAdmin',
            'commandsCatfacts',
            'commandsCats',
            'commandsChannel',
            'commandsDragons',
            'commandsHelp',
            'commandsLmgtfy',
            'commandsMentions',
            'commandsPing',
            'commandsPlay',
            // 'commandsPoll',
            // 'commandsPositions',
            'commandsPs2dig',
            // 'commandsPs2digfeedback',
            'commandsRestart',
            'commandsSfx',
            // 'commandsSort',
            'commandsStarted',
            'commandsStats',
            'commandsTrivia',
        ];
    }

    /**
     * Register any app dependencies
     */
    register() {
        this.container.register('commandRegister', asClass(CommandRegister)
            .singleton());
    }

    /**
     * Boots any dependency
     *
     * @return {Promise<void>}
     */
    async boot({ commandRegister }) {
        for (const command of this.commands) {
            if (isString(command)) {
                commandRegister.add(this.container.resolve(command));
            } else {
                commandRegister.add(this.container.build(command));
            }
        }

        play.ready();
        sfx.ready();
    }
};
