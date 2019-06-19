import { CRUDService } from "../../services/_crud-service";
import { Page, PageBuilder } from "../../models";
import { PaginationInfo } from "../../middlewares";

import db from '../models-impl';

export class AbstractCRUDFacade<T> 
    implements CRUDService<T>{

    create(item: any): Promise<string | number | T> {
        return <Promise<T>>db.SequelizeUser.create(item);
    }

    bulkCreate(items: any[]): Promise<T[] | number[] | string[]> {
        return <Promise<T[]>>db.SequelizeUser
            .bulkCreate(items, { returning: true });
    }
    
    async findPage(pageInfo: PaginationInfo): Promise<Page<T>> {
        try {
            const { rows, count } = await db.SequelizeUser
                .findAndCountAll({
                    offset: pageInfo.offset,
                    limit: pageInfo.ps
                });
            const page = PageBuilder.withPageInfo(pageInfo, rows)
                .totalCount(count)
                .build();
            return <Promise<Page<T>>><unknown>Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    findByPk(pk: string | number): Promise<T | null> {
        return <Promise<T>>db.SequelizeUser.findByPk(pk);
    }
    
    async deleteByPk(pk: string | number): Promise<boolean> {
        try {
            const rowsCount = await db.SequelizeUser.destroy({ where: { id: pk } });
            return Promise.resolve(rowsCount > 0);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async updateByPk(pk: string | number, props: { [p: string]: any; }[]): Promise<{ successful: boolean; args: { [p: string]: any; }; }> {
        try {
            const [affected] = await db.SequelizeUser.update(props, {
                where: { id: pk }
            });
            return Promise.resolve({
                successful: affected > 0,
                args: props
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    count(): Promise<number> {
        return db.SequelizeUser.count();
    }
}
