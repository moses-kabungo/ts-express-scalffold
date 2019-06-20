
import { CRUDService } from '../../services/_crud-service';
import { PaginationInfo } from '../../middlewares';
import { Page, PageBuilder } from '../../models';

import { BaseModel } from '../models-impl/_base-model';
import { CreateOptions, FindAndCountOptions, DestroyOptions, UpdateOptions } from 'sequelize/types';
import { FindOptions } from 'sequelize';
import { CountOptions } from 'sequelize';

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
    
    async findPage(pageInfo: PaginationInfo, opts?: FindAndCountOptions): Promise<Page<T>> {
        try {
            const { rows, count } = await this.ModelType.findAndCountAll({
                offset: pageInfo.offset, limit: pageInfo.ps, ...opts
            });
            const page = PageBuilder.withPageInfo(pageInfo, rows)
                .totalCount(count)
                .build();
            return <Promise<Page<T>>><unknown>Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async findByPk(pk: string | number, opts?: FindOptions): Promise<T | null> {
        return <Promise<T | null>>this.ModelType.findByPk(pk, opts);
    }
    
    async deleteByPk(pk: string | number, opts?: DestroyOptions): Promise<boolean> {
        try {
            const rowsCount = await this.ModelType.destroy({ where: { id: pk }, ...opts });
            return Promise.resolve( rowsCount > 0 );
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async updateByPk(pk: string | number,
        props: { [p: string]: any; }[], opts?: UpdateOptions): Promise<{
        successful: boolean,
        args: { [p: string]: any; };
    }> {
        try {
            const [rowsCount, _] = await this.ModelType
                .update(props, { where: { id: pk }, ...opts });
            void(_);
            return Promise.resolve({
                successful: rowsCount > 0,
                args: props
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
