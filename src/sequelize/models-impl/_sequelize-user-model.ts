import * as bcrypt from 'bcrypt';

import { Sequelize, ModelOptions } from 'sequelize';
import { User } from '../../models';
import { userAttributes } from './_user-attrs';

export const usersMapper = (sequelize: Sequelize): BaseModel<User> => {

    const modelOptions: ModelOptions = {
        tableName: 'users',
        underscored: true,
        defaultScope: {
            attributes: { exclude: [ 'password' ] }
        }
    }

    const SequelizeUser = <BaseModel<User>>sequelize
        .define('users', userAttributes(sequelize), modelOptions);

    SequelizeUser.beforeCreate((attributes) => {
        return bcrypt.hash((<any>attributes).password, 12)
            .then(hash => {
                (<any>attributes).password = hash;
            })
            .catch(err => console.error(err));
    });

    return SequelizeUser;
};
