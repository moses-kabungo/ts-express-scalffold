
import { Router } from 'express';
import { SequelizeUsersService } from '../sequelize/services-impl/_sequelize-users.service';
import { UsersApi } from './users';
import { ICacheService, TokenDecoder, TokenEncoder } from '../services';
import { User } from '../models';

export function api(
    cacheService: ICacheService,
    tokenVerfier: TokenDecoder<User> & TokenEncoder<User>
) {
    const _api = Router();

    // Users API
    const _usersApi: UsersApi = new UsersApi(
        new SequelizeUsersService(cacheService, tokenVerfier));

    _api.use('/users', _usersApi.init());

    return _api;
}
