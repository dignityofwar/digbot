export function env(key: string): string | undefined;
export function env(key: string, def: string): string;
export function env(key: string, def?: string) {
    return process.env[key] ?? def;
}

export function envRequired(key: string): string {
    if (process.env[key] === undefined)
        throw new Error(`Environment variable "${key}" not set`);

    return process.env[key];
}