export function role(id: string): string {
    return `<@&${id}>`;
}

export function channel(id: string): string {
    return `<#${id}>`;
}

export function member(id: string): string {
    return `<@${id}>`;
}

export enum TimestampFormat {
	SHORT_TIME = 't',
	LONG_TIME = 'T',
	SHORT_DATE = 'd',
	 LONG_DATE = 'D',
     SHORT = 'f',
	 LONG = 'F',
	RELATIVE = 'R',
}

export function timestamp(timestamp: Date, format?: TimestampFormat): string {
    return `<t:${Math.round(timestamp.valueOf() / 1000)}:${format}>`;
}
