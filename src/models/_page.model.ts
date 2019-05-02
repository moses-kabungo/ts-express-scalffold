import * as querystring from 'querystring';
import { PaginationInfo } from "../middlewares/paginator";

export class Page<T> {

    constructor(
        public page: number,
        public pagesCount: number,
        public itemsCount: number,
        public hasPrev: boolean,
        public hasNext: boolean,
        public nextPage: string|null,
        public prevPage: string|null,
        public items: T[]
    ) {}
}

export class PageBuilder<T> {

    constructor(private page: Page<T>) {}

    static withPageInfo<T>(pageInfo: PaginationInfo, items: T[]) {
        const page = pageInfo.page;
        const totalCount: number = pageInfo.totalCount;
        const count = Math.ceil(totalCount / pageInfo.limit);
        const hasNext = page < count;
        const hasPrev = page > 1;
        const sortBy = pageInfo.sortBy;
        const sortOrder = pageInfo.sortOrder;
        let nextPage: string = '';
        let prevPage: string = '';

        const params = { page, pageSize: pageInfo.limit, sortBy, sortOrder };

        if (!pageInfo.sortBy) {
            delete params.sortBy;
            delete params.sortOrder;
        } else {
            params.sortBy = pageInfo.sortBy;
            params.sortOrder = pageInfo.sortOrder ? pageInfo.sortOrder : 'desc';
        }

        if ( hasNext ) {
            params.page += 1;
            const qs = querystring.stringify(params);
            nextPage = pageInfo.url + "?" + qs;
        }
        
        if (hasPrev) {
            params.page -= 1;
            const qs = querystring.stringify(params);
            prevPage = pageInfo.url + "?" + qs;
        }

        const _page = new Page<T>(
            page,
            count,
            totalCount,
            hasPrev,
            hasNext,
            (nextPage.length ? nextPage : null),
            (prevPage.length ? prevPage : null),
            items
        );

        return new PageBuilder(_page);
    }

    build() {
        return this.page;
    }
}