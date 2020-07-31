import Hashable from '../concerns/Hashable';

export default class HashMap<K extends Hashable, V> extends Map<K, V> {
    private readonly map: Map<string, [V, K]> = new Map<string, [V, K]>();

    public constructor() {
        super();
    }

    public clear(): void {
        this.map.clear();
    }

    public delete(key: K): boolean {
        return this.map.delete(key.hash());
    }

    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
        this.map.forEach((value) => callbackfn(value[0], value[1], this), thisArg);
    }

    public get(key: K): V | undefined {
        const v = this.map.get(key.hash());
        return v ? v[0] : undefined;
    }

    public has(key: K): boolean {
        return this.map.has(key.hash());
    }

    public set(key: K, value: V): this {
        this.map.set(key.hash(), [value, key]);
        return this;
    }

    public get size(): number {
        return this.map.size;
    }
}
