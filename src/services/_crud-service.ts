import { PaginationInfo } from "../middlewares";
import { Page } from "../models";

export interface CRUDService<T> {
    create(item: T): Promise<number | string | T>;
    bulkCreate(items: T[]): Promise<number[] | string[] | T[]>;
    findPage(pageInfo: PaginationInfo): Promise<Page<T>>;
    findByPk(pk: string | number): Promise<T | null>;
    deleteByPk(pk: string | number): Promise<boolean>;
    updateByPk(pk: string | number, props: {[p: string]: any}[]): Promise<{
        successful: boolean, args: { [p:string]: any }
    }>;
}
