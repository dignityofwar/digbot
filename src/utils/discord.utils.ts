export function role(id: string): string {
    return `<@&${id}>`;
}

export function channel(id: string): string {
    return `<#${id}>`;
}

export function member(id: string): string {
    return `<@${id}>`;
}

export function timestampRelative(timestamp: Date): string {
    return `<t:${Math.round(timestamp.valueOf() / 1000)}:R>`;
}
