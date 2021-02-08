export function unique<T>(current: T, index: number, array: T[]): boolean {
    return index == array.indexOf(current);
}

export function empty<T>(current: T): boolean {
    return current !== null && current !== undefined;
}
