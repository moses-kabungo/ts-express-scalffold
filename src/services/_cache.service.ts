import Promise from 'bluebird';

export interface ICacheService {
    set(key: string,  value: any): Promise<boolean>;
    get(key: string): Promise<any|undefined>;
    has(key: string): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    deleteAll(): Promise<boolean>;
    size(): Promise<number>;
}
