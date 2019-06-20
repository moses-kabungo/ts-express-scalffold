import { PaginationInfo } from "../middlewares";
import { Page } from "../models";

export interface CRUDService<T> {
    create(item: T, opts?: object): Promise<number | string | T>;
    bulkCreate(items: T[], opts?: object): Promise<number[] | string[] | T[]>;
    findPage(pageInfo: PaginationInfo, opts?: object): Promise<Page<T>>;
    findByPk(pk: string | number, opts?: object): Promise<T | null>;
    deleteByPk(pk: string | number, opts?: object): Promise<boolean>;
    updateByPk(pk: string | number, props: {[p: string]: any}[], opts?: object): Promise<{
        successful: boolean,
        args: { [p:string]: any }
    }>;
    count(opts?: object): Promise<number>;
}
