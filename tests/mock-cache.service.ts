import { ICacheService } from "../src/services/_cache.service";

const parse   = JSON.parse;
const resolve = Promise.resolve;

export class MockCacheService implements ICacheService {

    private items: Map<string, string>;

    constructor() {
        this.items = new Map();
    }

    set(key: string, value: any): Promise<boolean> {
        this.items.set(key, JSON.stringify(value));
        return resolve(true);
    } 
    
    get(key: string): Promise<any|undefined> {
        const value = this.items.get(key);
        return resolve(value === undefined ? undefined : parse(String(value)));
    }

    has(key: string): Promise<boolean> {
        return resolve(this.items.has(key));
    }

    delete(key: string): Promise<boolean> {
        return this.has(key).then(exists => exists
                ? resolve(this.items.delete(key))
                : resolve(false));
    }

    deleteAll(): Promise<boolean> {
        this.items.clear();
        return resolve(true);
    }
    size(): Promise<number> {
        return resolve(this.items.size);
    }
}
