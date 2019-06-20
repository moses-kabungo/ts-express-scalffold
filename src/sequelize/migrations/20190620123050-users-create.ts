import { userAttributes } from '../models-impl/_user-attrs';
import { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('users', userAttributes(queryInterface.sequelize));
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('users');
	}
};