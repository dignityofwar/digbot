export function parseMentionArg(arg: string): string | undefined {
    return (arg.match(/[0-9]{18,}/) ?? [])[0];
}

export function parseChannelArg(arg: string): string | undefined {
    return (arg.match(/[0-9]{18,}/) ?? [])[0];
}