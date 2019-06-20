
import { CRUDService } from '../../services/_crud-service';
import { PaginationInfo } from '../../middlewares';
import { Page, PageBuilder } from '../../models';

import { CreateOptions, FindAndCountOptions, DestroyOptions, UpdateOptions } from 'sequelize/types';
import { CountOptions } from 'sequelize';
import { Transaction } from 'sequelize';

export class SequelizeCRUDFacade<T> implements CRUDService<T> {

    protected ModelType: BaseModel<T>;

    constructor(modelType: BaseModel<T>) {
        this.ModelType = modelType;
    }

    count(opts?: CountOptions): Promise<number> {
        return this.ModelType.count(opts);
    }

    create(item: any, opts?: CreateOptions): Promise<string | number | T> {
        return <Promise<T>>this.ModelType.create(item, opts);
    }
    
    bulkCreate(items: T[], opts?: CreateOptions): Promise<T[] | number[] | string[]> {
        return <Promise<T[]>>this.ModelType.bulkCreate(<Object[]>items, opts);
    }
    
    async findPage(opts: FindAndCountOptions & { pageInfo: PaginationInfo }): Promise<Page<T>> {
        try {
            const { rows, count } = await this.ModelType.findAndCountAll({
                offset: opts.offset, limit: opts.limit
            });
            const page = PageBuilder.withPageInfo(opts.pageInfo, rows)
                .totalCount(count)
                .build();
            return <Promise<Page<T>>><unknown>Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async findByPk(pk: string | number, opts?: { transaction: Transaction }): Promise<T | null> {
        return <Promise<T | null>>this.ModelType.findByPk(pk, opts);
    }
    
    async deleteByPk(pk: string | number, opts: DestroyOptions): Promise<boolean> {
        try {
            const rowsCount = await this.ModelType.destroy(opts);
            return Promise.resolve( rowsCount > 0 );
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async updateByPk(
        props: { [p: string]: any; }, opts: UpdateOptions): Promise<number> {
        try {
            const [rowsCount] = await this.ModelType
                .update(props, opts);
            return Promise.resolve(rowsCount);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
