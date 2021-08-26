import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {DiscoveryService, MetadataScanner} from '@nestjs/core';
import {InstanceWrapper} from '@nestjs/core/injector/instance-wrapper';
import {MetadataAccessor} from './helpers/metadata.accessor';
import {OnDecoratorOptions} from './decorators/interfaces/ondecorator.options';
import {ClusterClient} from 'detritus-client';

@Injectable()
export class DiscordExplorer implements OnModuleInit {
    private static readonly logger = new Logger('DiscordExplorer');

    constructor(
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
        ([
            ...this.discoveryService.getProviders(),
            ...this.discoveryService.getControllers(),
        ] as InstanceWrapper[])
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
        metadata: OnDecoratorOptions,
    ): void {
        DiscordExplorer.logger.log(`Registered event ${metadata.event} on ${instance.constructor.name}@${key}`);

        client.on(
            metadata.event,
            instance[key].bind(instance),
        );
    }
}
