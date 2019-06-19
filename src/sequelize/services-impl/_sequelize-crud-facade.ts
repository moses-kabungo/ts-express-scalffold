
import { CRUDService } from '../../services/_crud-service';
import { PaginationInfo } from '../../middlewares';
import { Page, PageBuilder } from '../../models';

import { BaseModel } from '../models-impl/_base-model';

export class SequelizeCRUDFacade<T> implements CRUDService<T> {

    protected ModelType: BaseModel<T>;

    constructor(modelType: BaseModel<T>) {
        this.ModelType = modelType;
    }


    count(): Promise<number> {
        return this.ModelType.count();
    }

    create(item: any): Promise<string | number | T> {
        return <Promise<T>>this.ModelType.create(item);
    }
    
    bulkCreate(items: T[]): Promise<T[] | number[] | string[]> {
        return <Promise<T[]>>this.ModelType.bulkCreate(<Object[]>items);
    }
    
    async findPage(pageInfo: PaginationInfo): Promise<Page<T>> {
        try {
            const { rows, count } = await this.ModelType.findAndCountAll({
                offset: pageInfo.offset, limit: pageInfo.ps
            });
            const page = PageBuilder.withPageInfo(pageInfo, rows)
                .totalCount(count)
                .build();
            return <Promise<Page<T>>><unknown>Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async findByPk(pk: string | number): Promise<T | null> {
        return <Promise<T | null>>this.ModelType.findByPk(pk);
    }
    
    async deleteByPk(pk: string | number): Promise<boolean> {
        try {
            const rowsCount = await this.ModelType.destroy({ where: { id: pk } });
            return Promise.resolve( rowsCount > 0 );
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async updateByPk(pk: string | number, props: { [p: string]: any; }[]): Promise<{
        successful: boolean,
        args: { [p: string]: any; };
    }> {
        try {
            const [rowsCount, _] = await this.ModelType
                .update(props, { where: { id: pk } });
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
