export default class CaseInsensitiveMap<T> extends Map<string, T> {
    public get(key: string): T | undefined {
        return super.get(key.toUpperCase());
    }

    public has(key: string): boolean {
        return super.has(key.toUpperCase());
    }

    public set(key: string, value: T): this {
        return super.set(key.toUpperCase(), value);
    }
}
