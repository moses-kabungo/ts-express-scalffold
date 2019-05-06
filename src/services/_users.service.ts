import Bluebird from 'bluebird';

import { User } from '../models';
import { PaginationInfo } from '../middlewares/_paginator.middleware';
import { Page } from '../models/_page.model';
import { LoginResponse } from '../models/_login-response.model';


global.Promise = Bluebird;

export interface IUsersService {
    create(user: User): Bluebird<string|User>;
    count(): Bluebird<number>;
    jwtEncode(user: User): Bluebird<string>;
    jwtDecode(token: string): Bluebird<User|undefined>;
    findById(id: string): Bluebird<User|undefined>;
    findPage(pageInfo: PaginationInfo): Bluebird<Page<User>>;
    login(loginId: string, password: string): Bluebird<LoginResponse>;
    logout(loginId: string): Bluebird<boolean>;
}
