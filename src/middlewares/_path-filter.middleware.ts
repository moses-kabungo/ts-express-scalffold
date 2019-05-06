import {
    NextFunction,
    Request,
    Response
} from "express";

export type RestPath = { methods: string[], path: RegExp };
export type RestPaths = RestPath[];
export type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

const noop = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export class RestPathsMatcher {

    private unprotectedPaths: RestPaths = []
    private middlewareFn: MiddlewareFn = noop;

    constructor() { }

    of(..._unprotectedPaths: string[]) {
        for (const pathStr of _unprotectedPaths) {
            const [methodsStr, expressionStr] = pathStr.split('--');
            const methods = methodsStr.trim().replace(/^[|]$/, '').split(',');
            const path = new RegExp(expressionStr);
            this.unprotectedPaths.push({ methods, path });
        }
        return this;
    }

    onMatchFound(middlewareFn: MiddlewareFn) {
        this.middlewareFn = middlewareFn;
    }
}
