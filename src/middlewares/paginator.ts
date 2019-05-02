import { NextFunction, Request, Response } from "express";

// Export sorting order. can either be in ascending or descending
export type SortOrder = 'asc' | 'desc';

// Export paginator config.
export interface PaginatorConfig {
    pageSize: number;
    defaultPage: number;
    sortBy?: string;
    sortOrder?: SortOrder;
}

// Information used to control the amount of resources to retrieve
// from the storage service.
export interface PaginationInfo {
    offset: number;
    limit: number;
    page: number;
    totalCount: number;
    url: string;
    sortBy?: string;
    sortOrder?: SortOrder;
}

// Default pagination info
const defaultPaginatorConfig: PaginatorConfig = {
    pageSize: parseInt(
        process.env.DEFAULT_PAGINATION_SIZE as string, 10),
    defaultPage: 1,
    sortBy: process.env.DEFAULT_SORT_PROPERTY,
    sortOrder: 'desc'
};

// Perform pagination calculation. Use default values if either client
// or user did not provide pagination info.
export class Paginator {

    constructor(
        private pageConfig: PaginatorConfig) { }


    update(page: number, url: string): PaginationInfo {
        const offset = (page - 1) * this.pageConfig.pageSize;
        return { offset, page: page, url, totalCount: 0, limit: this.pageConfig.pageSize, sortBy: this.pageConfig.sortBy, sortOrder: this.pageConfig.sortOrder };
    }

    paginate(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        req.query.paginationInfo = this.update(
            parseInt(req.query.page) || this.pageConfig.defaultPage, req.url);
        next();
    }
}

// Export paginator
export const paginator = (
    pageConfig: PaginatorConfig = defaultPaginatorConfig
) => {
    return new Paginator(pageConfig);
}
