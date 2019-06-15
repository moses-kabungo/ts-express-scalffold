import { Sequelize } from 'sequelize-typescript';
import { SequelizeUser } from './_sequelize-user.model';
import { getDbConfig } from '../../config/_db.config';
import { AppEnv } from '../../config/_env-def.config';

const sequelize = new Sequelize(getDbConfig(process.env.NODE_ENV as AppEnv));

sequelize.addModels([SequelizeUser]);

export const db = {
    sequelize,
    Sequelize
};
