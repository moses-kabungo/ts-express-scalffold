import { Page } from "../models";
import { PaginationInfo } from "../middlewares";

export interface CRUDService<T> {
    create(item: T, opts?: object): Promise<number | string | T>;
    bulkCreate(items: T[], opts?: object): Promise<number[] | string[] | T[]>;
    findPage(opts: object & { pageInfo: PaginationInfo }): Promise<Page<T>>;
    findByPk(pk: string | number, opts?: object): Promise<T | null>;
    deleteByPk(pk: string | number, opts?: object): Promise<boolean>;
    updateByPk(props: {[p: string]: any}, opts: object): Promise<{
        successful: boolean,
        args: { [p:string]: any }
    }>;
    count(opts?: object): Promise<number>;
}
