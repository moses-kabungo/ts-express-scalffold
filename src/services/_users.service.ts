import { User } from '../models';
import { PaginationInfo } from '../middlewares/_paginator.middleware';
import { Page } from '../models/_page.model';
import { LoginResponse } from '../models/_login-response.model';


export interface IUsersService {
    create(user: User): Promise<string|User>;
    count(): Promise<number>;
    jwtEncode(user: User): Promise<string>;
    jwtDecode(token: string): Promise<User|undefined>;
    findById(id: string): Promise<User|undefined>;
    findPage(pageInfo: PaginationInfo): Promise<Page<User>>;
    login(loginId: string, password: string): Promise<LoginResponse>;
    logout(userId: string): Promise<boolean>;
}
