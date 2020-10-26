import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { DiscordClient } from './discord.client';
import { DiscordResolver } from './interfaces/discord.resolver';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { OnResolver } from './resolvers/on.resolver';

@Injectable()
export class DiscordService implements OnApplicationBootstrap {
    private readonly resolvers: DiscordResolver[];

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly discordClient: DiscordClient,
        onResolver: OnResolver,
    ) {
        this.resolvers = [
            onResolver,
        ];
    }

    onApplicationBootstrap(): void {
        this.resolve(
            this.discoveryService.getProviders(),
            this.discoveryService.getControllers(),
        );
    }

    resolve(providers: InstanceWrapper[], controllers: InstanceWrapper[]): void {
        providers.concat(controllers).forEach(({instance}) => {
            if (instance) {
                this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (methodName) => {
                    this.resolvers.forEach((resolver) => {
                        resolver.resolve(instance, methodName, this.discordClient);
                    });
                });
            }
        });
    }
}
