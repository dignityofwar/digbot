import {DiscoveryService, MetadataScanner} from '@nestjs/core';
import {Injectable, Logger} from '@nestjs/common';
import {MetadataAccessor} from './helpers/metadata.accessor';
import {CommandContainer} from './command.container';
import {CommandDecoratorOptions} from './decorators/interfaces/commanddecorator.options';

@Injectable()
export class CommandExplorer {
    private static readonly logger = new Logger('CommandExplorer');

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly metadataAccessor: MetadataAccessor,
        private readonly commandContainer: CommandContainer,
    ) {
    }

    explore(): void {
        this.discoveryService.getControllers()
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
        metadata: CommandDecoratorOptions,
    ): void {
        CommandExplorer.logger.log(`Registered command ${metadata.command} on ${instance.constructor.name}@${key}`);

        container.register(metadata, instance[key].bind(instance));
    }
}
