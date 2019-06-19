import { Model } from "sequelize-typescript";
import { CRUDService } from "../../services/_crud-service";
import { Page, PageBuilder } from "../../models";
import { PaginationInfo } from "../../middlewares";
import { BaseModel } from "../models-impl/_base-model";

export class AbstractCRUDFacade<T extends Model<T>> 
    implements CRUDService<T>{

    create(item: T): Promise<string | number | T> {
        return <Promise<T>>BaseModel.create(item);
    }

    bulkCreate(items: T[]): Promise<T[] | number[] | string[]> {
        return <Promise<T[]>>BaseModel
            .bulkCreate(items, { returning: true });
    }
    
    async findPage(pageInfo: PaginationInfo): Promise<Page<T>> {
        try {
            const { rows, count } = await BaseModel.findAndCountAll({
                offset: pageInfo.offset,
                limit: pageInfo.ps
            });
            const page = PageBuilder.withPageInfo(pageInfo, rows)
                .totalCount(count)
                .build();
            return <Promise<Page<T>>>Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    findByPk(pk: string | number): Promise<T | null> {
        return BaseModel.findByPk(pk);
    }
    
    async deleteByPk(pk: string | number): Promise<boolean> {
        try {
            const rowsCount = await BaseModel.destroy({ where: { id: pk } });
            return Promise.resolve(rowsCount > 0);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    
    async updateByPk(pk: string | number, props: { [p: string]: any; }[]): Promise<{ successful: boolean; args: { [p: string]: any; }; }> {
        try {
            const [affected] = await BaseModel.update(props, {
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
        return BaseModel.count();
    }
}
