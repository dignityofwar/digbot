export function role(id: string): string {
    return `<@&${id}>`;
}

export function channel(id: string): string {
    return `<#${id}>`;
}

export function member(id: string): string {
    return `<@${id}>`;
}
