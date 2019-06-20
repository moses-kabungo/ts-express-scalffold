import { Sequelize, DataTypes } from "sequelize";
// import { User } from "../../models";

export const userAttributes = (sequelize: Sequelize) => {

    const _attrs = {
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
        last_seen_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        require_password_change: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        }
    };

    return _attrs;
};
