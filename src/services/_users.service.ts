
import { User } from '../models';
import { PaginationInfo } from '../middlewares/paginator';
import { Page } from '../models/_page.model';

export interface IUsersService {
    create(user: User): Promise<string | User>;
    count(): Promise<number>;
    findById(id: string): Promise<User | undefined>;
    findPage(pageInfo: PaginationInfo): Promise<Page<User>>
}
