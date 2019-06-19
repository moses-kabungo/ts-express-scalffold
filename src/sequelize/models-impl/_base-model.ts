import { Model } from "sequelize-typescript";

export class BaseModel<T> extends Model<T> {
    constructor(...args: any[]) {
        super(args);
    }
}