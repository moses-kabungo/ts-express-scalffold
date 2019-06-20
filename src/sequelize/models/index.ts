import { Sequelize, Options } from 'sequelize';
import { usersMapper } from '../models-impl/_sequelize-user-model';
import { getDbConfig } from '../../config/_db.config';
import { AppEnv } from '../../config/_env-def.config';
import { DbInterface } from '../models-impl/_db-interface';

const opts: Options = getDbConfig(process.env.NODE_ENV as AppEnv);
console.log(opts);
const sequelize = new Sequelize(opts);
const SequelizeUser = usersMapper(sequelize);

export default <DbInterface>{
    sequelize,
    Sequelize,
    SequelizeUser
};