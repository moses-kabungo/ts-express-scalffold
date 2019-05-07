import { ICacheService } from "../src/services/_cache.service";
import { MockCacheService } from "./mock-cache.service";

describe('Mock cache service', () => {
    let cacheService: ICacheService;

    beforeAll(() => {
        cacheService = new MockCacheService();
    });

    test("#set should add new item", async () => {
        await expect(cacheService.size()).resolves.toEqual(0);
        cacheService.set("greeting-en", "Hello world!");
        await expect(cacheService.size()).resolves.toEqual(1);
    });

    test('#get should retrieve item', async() => {
        await expect(cacheService.get('greeting-en')).resolves.toEqual('Hello world!');
    });

    test('#get should return undefined when key is not found', async () => {
        await expect(cacheService.get('none existing key')).resolves.toBeUndefined();
        await expect(cacheService.has('undefined')).resolves.toBe(false);
    });
});
