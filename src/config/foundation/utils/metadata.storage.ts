import {EnvOptions} from '../types/env.options';

export class MetadataStorage {
    private readonly configMap = new Map<Function, Map<string, EnvOptions>>();

    setEnvMetadata(target: Function, property: string, config: EnvOptions): void {
        if (!this.configMap.has(target))
            this.configMap.set(target, new Map());

        this.configMap.get(target).set(property, config);
    }

    getEnvProperties(target: Function): string[] {
        if (!this.configMap.has(target))
            return [];

        return Array.from(this.configMap.get(target)?.keys());
    }

    getEnvMetadata(target: Function, property: string): EnvOptions | null {
        return this.configMap.get(target)?.get(property) ?? null;
    }
}
