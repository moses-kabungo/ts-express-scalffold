import { Model, BuildOptions } from "sequelize";

export type BaseModel<T> = typeof Model & {
    new (values?: object, options?: BuildOptions): T;
};
