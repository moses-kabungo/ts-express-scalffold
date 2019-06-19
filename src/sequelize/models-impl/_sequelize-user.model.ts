import { Table, Column, DataType, Unique } from 'sequelize-typescript';
import { User } from '../../models';
import { BaseModel } from './_base-model';

@Table({
    timestamps: true,
    underscored: true
})
export class SequelizeUser extends BaseModel<SequelizeUser> implements User {
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
