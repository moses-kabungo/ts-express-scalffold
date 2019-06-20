import { Sequelize } from "sequelize";
import { User } from "../../models";

export interface DbInterface {
    sequelize: Sequelize,
    Sequelize: typeof Sequelize,
    SequelizeUser: BaseModel<User>
}