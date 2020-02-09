import Handler from '../bot/handler';
import { discordEvent } from '../bot/events';
import { Message } from 'discord.js';
import { injectable } from 'inversify';
import { Logger } from 'winston';
import { childLogger } from '../logger/logger';

@injectable()
export default class CommandHandler extends Handler {
    private static logger: Logger = childLogger('command-handler');
    /**
     * A map that maps events names to a method that handles it
     */
    public readonly listeners: Map<string, discordEvent> = new Map<string, discordEvent>([
        ['message', this.onMessage],
    ]);

    /**
     * @param message
     */
    public onMessage(message: Message): void {
        CommandHandler.logger.info('Hello there');
    }
}
