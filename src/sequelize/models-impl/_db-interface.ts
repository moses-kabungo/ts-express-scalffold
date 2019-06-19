import { Sequelize } from "sequelize";
import { BaseModel } from "./_base-model";
import { User } from "../../models";

export interface DbInterface {
    sequelize: Sequelize,
    Sequelize: typeof Sequelize,
    SequelizeUser: BaseModel<User>
}