export interface CommandDecoratorOptions {
    command: string;
    description: string;
    adminOnly?: boolean;
    tags?: string[];
}
