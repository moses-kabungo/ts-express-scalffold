import { Router } from 'express';

import { createUser } from './_users.create';
import { IUsersService } from '../../services';


const users = Router();

export function UsersApi(config: { usersService: IUsersService }) {

    // Create new users
    users.post('/', createUser(config));

    return users;
};