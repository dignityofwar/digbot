import { DiscordResolver } from '../interfaces/discord.resolver';
import { OnDecoratorOptions } from '../decorators/interfaces/ondecorator.options';
import { ON_DECORATOR } from '../constants/discord.constants';
import { ClientEvents } from 'discord.js';
import { DiscordClient } from '../discord.client';

export class OnResolver implements DiscordResolver {
    public resolve(instance: Record<string, any>, methodName: string, discordClient: DiscordClient): void {
        const metadata: OnDecoratorOptions | keyof ClientEvents = Reflect.getMetadata(ON_DECORATOR, instance, methodName);

        if (metadata) {
            const event = typeof metadata == 'string' ? metadata : metadata.event;

            discordClient.on(event, (...data) => {
                void instance[methodName](...data);
            });
        }
    }
}
