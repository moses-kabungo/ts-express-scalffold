import * as querystring from 'querystring';
import { PaginationInfo } from "../middlewares/_paginator.middleware";
import { assert } from '../utils';

export class Page<T> {

    constructor(
        public pi: number,
        public pc: number,
        public ps: number,
        public total: number,
        public hasPrev: boolean,
        public hasNext: boolean,
        public nextPage: string | null,
        public prevPage: string | null,
        public items: T[]
    ) {}
}

export class PageBuilder<T> {

    constructor(private page: Page<T>, private pageInfo: PaginationInfo) {}

    static withPageInfo<T>(pageInfo: PaginationInfo, items: T[]) {
        const pi = pageInfo.pi;
        const total: number = NaN;
        const pc = NaN;
        const ps = pageInfo.ps;
        const hasNext = false
        const hasPrev = pi > 1;

        const _page = new Page<T>(
            pi, pc, ps, total, hasPrev, hasNext, null, null, items
        );

        return new PageBuilder(_page, pageInfo);
    }

    totalCount(total: number) {
        this.page.total = total;
        return this;
    }

    build() {
        assert(!isNaN(this.page.total), "needs to know total number of items");

        this.page.pc = Math.ceil(this.page.total / this.page.ps);
        this.page.hasNext = this.page.pi < this.page.pc;
        this.page.hasPrev = this.page.pi > 1;
        
        const sortBy = this.pageInfo.sortBy;
        const sortOrder = this.pageInfo.sortOrder;
        
        const params = { pi: this.page.pi, ps: this.page.ps, sortBy, sortOrder };

        if ( this.page.hasPrev ) {
            const prevParams = JSON.parse(JSON.stringify(params));
            prevParams.pi -= 1;
            const qs = querystring.stringify(prevParams);
            this.page.prevPage = this.pageInfo.url.replace(/\?.*/, '') + "?" + qs;
        }

        if ( this.page.hasNext ) {
            const nextParams = JSON.parse(JSON.stringify(params));
            nextParams.pi += 1;
            const qs = querystring.stringify(nextParams);
            this.page.nextPage = this.pageInfo.url.replace(/\?.*/, '') + "?" + qs;
        }
        return this.page;
    }
}