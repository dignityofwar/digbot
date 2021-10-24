import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {DiscoveryService, MetadataScanner} from '@nestjs/core';
import {MetadataAccessor} from '../helpers/metadata.accessor';
import {ClusterClient} from 'detritus-client';
import {fromEvent} from 'rxjs';
import {DiscordEventOptions} from '../decorators/discord-event.decorator';

@Injectable()
export class DiscordExplorer implements OnModuleInit {
    constructor(
        private readonly logger: Logger,
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly metadataAccessor: MetadataAccessor,
        private readonly discord: ClusterClient,
    ) {
    }

    onModuleInit(): void {
        this.explore();
    }

    explore(): void {
        this.discoveryService.getProviders()
            .filter(w => w.instance)
            .forEach(({instance}) => {
                this.metadataScanner.scanFromPrototype(
                    instance,
                    Object.getPrototypeOf(instance),
                    (key) => {
                        const metadata = this.metadataAccessor.getOnMetadata(instance[key]);

                        if (metadata) {
                            this.handleOn(
                                instance,
                                key,
                                this.discord,
                                metadata,
                            );
                        }
                    },
                );
            });
    }

    handleOn(
        instance: object,
        key: string,
        client: ClusterClient,
        metadata: DiscordEventOptions,
    ): void {
        this.logger.verbose(`Registered event handler for ${metadata.event} on ${instance.constructor.name}@${key}`);

        fromEvent(client, metadata.event)
            .subscribe(instance[key].bind(instance));
    }
}
