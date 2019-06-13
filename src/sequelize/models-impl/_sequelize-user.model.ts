import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';
import { User } from '../../models';

@Table({
    timestamps: true,
    underscored: true
})
export class SequelizeUser extends Model<SequelizeUser> implements User {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    })
    public id?: number;
    
    @Column public name!: string;
    
    @Column
    @Unique
    public email!: string;
    
    @Column public password!: string;
}
