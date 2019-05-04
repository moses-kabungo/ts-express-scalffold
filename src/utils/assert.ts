export function assert(boolExpr: boolean, msg: string) {
    if (!boolExpr) {
        throw new Error(msg);
    }
}
