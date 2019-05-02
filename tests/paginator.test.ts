import { PaginationInfo, paginator } from "../src/middlewares/paginator";
import { PageBuilder, Page } from "../src/models";

describe('paginator', () => {

    // 0..499 (a total of 500 naturals)
    const allItems = [...Array(500).keys()];

    test('it should build pagination', () => {

        const p0: PaginationInfo = paginator({
            pageSize: 25,
            defaultPage: 1
        }).update(1,
            'http://127.0.0.1/naturals'
        );

        p0.totalCount = allItems.length;

        const res0: Page<number> = PageBuilder
            .withPageInfo(p0, allItems.slice(0, 25))
            .build();

        expect(res0.hasNext).toBe(true);
        expect(res0.hasPrev).toBe(false);
        expect(res0.items).toEqual(allItems.slice(0, 25));
        expect(res0.nextPage).toBe('http://127.0.0.1/naturals?page=2&pageSize=25');
        expect(res0.prevPage).toBeNull();
        expect(res0.pagesCount).toBe(20);

        const p1: PaginationInfo = paginator().update(2, 'http://127.0.0.1/naturals');
        p1.totalCount = allItems.length;
        const res1: Page<number> = PageBuilder
            .withPageInfo(p1, allItems.slice(25, 25))
            .build();
        
        expect(res1.hasNext).toBe(true);
        expect(res1.hasPrev).toBe(true);
    });

});
