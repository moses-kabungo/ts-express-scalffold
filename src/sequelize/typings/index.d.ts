import {
    ModelAttributeColumnOptions,
    AbstractDataTypeConstructor,
    AbstractDataType,
    ModelAttributes,
    Model,
    BuildOptions
} from "sequelize";

declare global {
    type SequelizeAttributes<T extends {[key: string]: any}> = ModelAttributes & {
        [P in keyof T]: string      |
        AbstractDataType            |
        AbstractDataTypeConstructor |
        ModelAttributeColumnOptions
    };

    type BaseModel<T> = typeof Model & {
        new (values?: object, options?: BuildOptions): T;
    };
}
