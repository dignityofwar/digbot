export interface CommandResolver {
    resolve(instance: Record<string, any>, methodName: string): void;
}
