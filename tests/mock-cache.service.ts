import { ICacheService } from "../src/services/_cache.service";


export class MockCacheService implements ICacheService {

    private items: Map<string, string>;

    constructor() {
        this.items = new Map();
    }

    set(key: string, value: any): Promise<boolean> {
        this.items.set(key, JSON.stringify(value));
        return Promise.resolve(true);
    } 
    
    get(key: string): Promise<any|undefined> {
        const value = this.items.get(key);
        return Promise.resolve(value === undefined ? undefined : JSON.parse(String(value)));
    }

    has(key: string): Promise<boolean> {
        return Promise.resolve(this.items.has(key));
    }

    delete(key: string): Promise<boolean> {
        return this.has(key).then(exists => exists
                ? Promise.resolve(this.items.delete(key))
                : Promise.resolve(false));
    }

    deleteAll(): Promise<boolean> {
        this.items.clear();
        return Promise.resolve(true);
    }
    size(): Promise<number> {
        return Promise.resolve(this.items.size);
    }
}
