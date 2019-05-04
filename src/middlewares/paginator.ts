import { NextFunction, Request, Response } from "express";

// Export sorting order. can either be in ascending or descending
export type SortOrder = 'asc' | 'desc';

// Export paginator config.
export interface PaginatorConfig {
    ps: number;
    pi: number;
}

// Information used to control the amount of resources to retrieve
// from the storage service.
export interface PaginationInfo {
    pi: number;
    offset: number;
    ps: number;
    url: string;
    sortBy?: string;
    sortOrder?: SortOrder;
}

// Perform pagination calculation. Use default values if either client
// or user did not provide pagination info.
export class Paginator {

    constructor(
        private pageConfig: PaginatorConfig) { }

    update(args: {
        pi: number,
        ps: number;
        sortOrder?: SortOrder,
        sortBy?: string,
        url: string
    }): PaginationInfo {
        return { offset: (args.pi - 1) * args.ps, ...args };
    }


    paginate(
        req: Request,
        _: Response,
        next: NextFunction
    ) {

        req.query.paginationInfo = this.update({
            pi: isNaN(req.query.pi) ? this.pageConfig.pi : Math.abs(parseInt(req.query.pi)),
            ps: isNaN(req.query.ps) ? this.pageConfig.ps : Math.abs(parseInt(req.query.ps)),
            url: req.url,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        });

        next();
    }
}

// Export paginator
export const paginator = (
    pageConfig: PaginatorConfig = {
        pi: 1, ps: 25
    }
) => {
    return new Paginator(pageConfig);
}
