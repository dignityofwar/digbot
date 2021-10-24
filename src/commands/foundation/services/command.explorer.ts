import {DiscoveryService, MetadataScanner} from '@nestjs/core';
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {MetadataAccessor} from '../helpers/metadata.accessor';
import {CommandContainer} from '../helpers/command.container';
import {DiscordCommandOptions} from '../decorators/discord-command.decorator';

@Injectable()
export class CommandExplorer implements OnModuleInit {
    constructor(
        private readonly logger: Logger,
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly metadataAccessor: MetadataAccessor,
        private readonly commandContainer: CommandContainer,
    ) {
    }

    onModuleInit(): void {
        this.explore();
    }

    explore(): void {
        this.discoveryService.getProviders()
            .filter(wrapper => wrapper.instance)
            .forEach(({instance}) => {
                this.metadataScanner.scanFromPrototype(
                    instance,
                    Object.getPrototypeOf(instance),
                    (key) => {
                        const metadata = this.metadataAccessor.getCommandMetadata(instance[key]);

                        if (metadata) {
                            this.registerCommand(
                                instance,
                                key,
                                this.commandContainer,
                                metadata,
                            );
                        }
                    },
                );
            });
    }

    registerCommand(
        instance: object,
        key: string,
        container: CommandContainer,
        metadata: DiscordCommandOptions,
    ): void {
        this.logger.verbose(`Registered command ${metadata.command} on ${instance.constructor.name}@${key}`);

        container.register(metadata, instance[key].bind(instance));
    }
}
