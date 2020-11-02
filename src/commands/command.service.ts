import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { OnApplicationBootstrap } from '@nestjs/common';
import { CommandResolver } from './interfaces/command.resolver';

export class CommandService implements OnApplicationBootstrap {
    private readonly resolvers: CommandResolver[];

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        commandResolver: CommandResolver,
    ) {
        this.resolvers = [
            commandResolver,
        ];
    }

    public onApplicationBootstrap(): void {
        this.discoveryService.getControllers().forEach(({instance}) => {
            if (instance) {
                this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (methodName) => {
                    this.resolvers.forEach((resolver) => {
                        resolver.resolve(instance, methodName);
                    });
                });
            }
        });
    }
}
