export function remove<T>(array: T[], item: T): boolean {
    const idx = array.indexOf(item);
    if (idx >= 0) array.splice(idx, 1);

    return idx >= 0;
}
