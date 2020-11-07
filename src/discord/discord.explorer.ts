import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { DiscordClient } from './discord.client';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataAccessor } from './helpers/metadata.accessor';
import { OnDecoratorOptions } from './decorators/interfaces/ondecorator.options';

/* eslint-disable @typescript-eslint/ban-types */

@Injectable()
export class DiscordExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly accessor: MetadataAccessor,
        private readonly discordClient: DiscordClient,
    ) {}

    onModuleInit(): void {
        this.explore();
    }

    explore(): void {
        ([
            ...this.discoveryService.getProviders(),
            ...this.discoveryService.getControllers(),
        ] as InstanceWrapper[]).forEach(({instance}) => {
            if (!instance) return;

            this.metadataScanner.scanFromPrototype(
                instance,
                Object.getPrototypeOf(instance),
                (key) => {
                    const metadata = this.accessor.getOnMetadata(instance[key]);

                    if (metadata) {
                        this.handleOn(
                            instance,
                            key,
                            this.discordClient,
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
        client: DiscordClient,
        metadata: OnDecoratorOptions,
    ): void {
        client.on(
            metadata.event,
            instance[key].bind(instance),
        );
    }
}
