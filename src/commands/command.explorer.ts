import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';

export class CommandExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
    ) {}

    onModuleInit(): any {
    }


    explore(): void {
        this.discoveryService.getControllers().forEach(({instance}) => {
            //
        });
    }
}
