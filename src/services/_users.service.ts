import { User } from '../models';
import { PaginationInfo } from '../middlewares/_paginator.middleware';
import { Page } from '../models/_page.model';
import { LoginResponse } from '../models/_login-response.model';


export interface IUsersService {
    create(user: User): Promise<number|string|User>;
    bulkCreate(users: User[]): Promise<(string|User)[]>;
    count(): Promise<number>;
    jwtEncode(user: User): Promise<string>;
    jwtDecode(token: string): Promise<User|null>;
    findById(id: string|number): Promise<User|null>;
    findPage(pageInfo: PaginationInfo): Promise<Page<User>>;
    login(loginId: string, password: string, validator: (hash: string, pwd: string) => boolean): Promise<LoginResponse>;
    logout(userId: string): Promise<boolean>;
}
