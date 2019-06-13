import { AppEnv } from "./_env-def.config";
import { SequelizeOptions } from "sequelize-typescript";

export type DbConfig = {[key in AppEnv]: SequelizeOptions};

const configs: DbConfig = {
    'development': {
        database: process.env.DEV_DB_NAME,
        dialect:  process.env.DEV_DB_DIALECT as SequelizeOptions["dialect"],
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD
    },
    'production': {
        database: process.env.DB_NAME,
        dialect:  process.env.DB_DIALECT as SequelizeOptions["dialect"],
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    'test': {
        database: process.env.CI_DB_NAME,
        dialect:  process.env.CI_DB_DIALECT as SequelizeOptions["dialect"],
        username: process.env.CI_DB_USERNAME,
        password: process.env.CI_DB_PASSWORD
    }
};

export function getDbConfig(appEnv: AppEnv) {
    return configs[appEnv];
}
