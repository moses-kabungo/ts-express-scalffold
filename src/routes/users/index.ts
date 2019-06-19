import { Router } from 'express';

import { UsersResource } from './_users.resource';
import { paginator } from '../../middlewares';
import { CRUDService } from '../../services/_crud-service';
import { User } from '../../models';
import { AuthService } from '../../services/_auth-service';


const users = Router();

export class UsersApi {

    constructor(private usersService: CRUDService<User> & AuthService) {}

    init() {
        const usersResource = new UsersResource(this.usersService);
        const paginatorInstance = paginator();
        // Create new users
        users.post('/', usersResource.create.bind(usersResource));
        // Bulk create users
        users.post('/bulk', usersResource.bulkCreate.bind(usersResource));
        // Get user by id
        users.get('/:id', usersResource.getById.bind(usersResource));
        // Get all users
        users.get('/',
            paginatorInstance.paginate.bind(paginatorInstance),
            usersResource.getPage.bind(usersResource)
        );
        // login user
        users.post('/auth', usersResource.doLogin.bind(usersResource));
        // logout user
        users.post('/:id/logout', usersResource.doLogout.bind(usersResource));
        
        return users;
    }
};