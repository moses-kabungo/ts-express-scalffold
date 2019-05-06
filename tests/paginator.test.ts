import { PaginationInfo, paginator } from "../src/middlewares/_paginator.middleware";
import { PageBuilder, Page } from "../src/models";

describe('paginator', () => {

    // 0..499 (a total of 500 naturals)
    const allItems = [...Array(500).keys()];

    test('it should build pagination', () => {

        const p0: PaginationInfo = paginator().update({
            pi: 1,
            ps: 25,
            url: 'http://127.0.0.1/naturals'
        });

        const res0: Page<number> = PageBuilder
            .withPageInfo(p0, allItems.slice(0, 25))
            .totalCount(allItems.length)
            .build();

        expect(res0.hasNext).toBe(true);
        expect(res0.hasPrev).toBe(false);
        expect(res0.items).toEqual(allItems.slice(0, 25));
        expect(res0.nextPage).toBe('http://127.0.0.1/naturals?pi=2&ps=25');
        expect(res0.prevPage).toBeNull();
        expect(res0.pc).toBe(20);

        const p1: PaginationInfo = paginator().update({
            pi: 2,
            ps: 10,
            url: 'http://127.0.0.1/naturals'
        });

        const res1: Page<number> = PageBuilder
            .withPageInfo(p1, allItems.slice(10, 10))
            .totalCount(allItems.length)
            .build();
        
        expect(res1.hasNext).toBe(true);
        expect(res1.hasPrev).toBe(true);
        expect(res1.nextPage).toBe('http://127.0.0.1/naturals?pi=3&ps=10');
        expect(res1.prevPage).toBe('http://127.0.0.1/naturals?pi=1&ps=10');
        expect(res1.pc).toBe(50);

        const p3 = paginator().update({
            pi: 50,
            ps: 10,
            url: 'http://127.0.0.1/naturals'
        });

        const res3 = PageBuilder
            .withPageInfo(p3, allItems.slice(490, 10))
            .totalCount(allItems.length)
            .build();

        expect(res3.hasNext).toBe(false);
        expect(res3.hasPrev).toBe(true);
        expect(res3.nextPage).toBeNull();
        expect(res3.prevPage).toBe('http://127.0.0.1/naturals?pi=49&ps=10');
        expect(res3.pc).toBe(50);
    });
});
