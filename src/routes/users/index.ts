import { Router } from 'express';

import { UsersResource } from './_users.resource';
import { IUsersService } from '../../services';


const users = Router();

export class UsersApi {

    constructor(private usersService: IUsersService) {}

    init() {
        const usersResource = new UsersResource(this.usersService);
        // Create new users
        users.post('/', usersResource.create.bind(usersResource));
        // Get user by id
        users.get('/:id', usersResource.getById.bind(usersResource));
        // login user
        users.post('/auth', usersResource.doLogin.bind(usersResource));
        // logout user
        users.post('/:id/logout', usersResource.doLogout.bind(usersResource));

        return users;
    }
};