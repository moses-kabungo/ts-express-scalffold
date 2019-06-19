import * as bcrypt from 'bcrypt';

import { Sequelize, DataTypes } from 'sequelize';
import { User } from '../../models';
import { BaseModel } from './_base-model';

export const usersMapper = (sequelize: Sequelize): BaseModel<User> => {

    const SequelizeUser = <BaseModel<User>>sequelize.define('users', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(56),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(127),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(127),
            allowNull: false
        },
        // created_at: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        // },
        // updated_at: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        // }
    }, {
            tableName: 'users',
            timestamps: false,
            underscored: true
        });

    SequelizeUser.beforeCreate((attributes, options) => {
        return bcrypt.hash((<any>attributes).password, 12)
            .then(hash => {
                (<any>attributes).password = hash;
            })
            .catch(err => console.error(err));
    })

    return SequelizeUser;
};

