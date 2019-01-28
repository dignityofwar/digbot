// const config = require('config');
const { asClass } = require('awilix');
const { isString } = require('lodash');
const ServiceProvider = require('../core/serviceprovider');

const CommandRegister = require('../core/commandregister');

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
            // 'commandsPs2digfeedback',
            'commandsRestart',
            'commandsSfx',
            // 'commandsSort',
            'commandsStarted',
            'commandsStats',
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
    async boot() {
        // TODO: Maybe add some boot method to commands?
        const register = this.container.resolve('commandRegister');

        for (const command of this.commands) {
            if (isString(command)) {
                register.add(this.container.resolve(command));
            } else {
                register.add(this.container.build(command));
            }
        }

        play.ready();
        sfx.ready();
    }
};
