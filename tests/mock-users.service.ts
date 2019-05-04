import { User, Page, PageBuilder } from "../src/models";
import { PaginationInfo } from '../src/middlewares/paginator';
import { IUsersService } from "../src/services";

export class MockUsersService implements IUsersService {

    private users: Map<string, User>;

    constructor() {
        this.users = new Map();
    }

    count(): Promise<number> {
        return Promise.resolve(this.users.size);
    }

    create(user: User): Promise<string | User> {
        this.users.set(user.id, user);
        return Promise.resolve(user);
    }

    findById(id: string): Promise<User | undefined> {
        const exists = this.users.has(id);
        return exists
            ? Promise.resolve(this.users.get(id))
            : Promise.reject(new Error(`No Such User ID: ${id}`));
    }

    async findPage(pageInfo: PaginationInfo): Promise<Page<User>> {
        try {
            const totalCount = await this.count();
            
            const items: User[] = Array
                .from(this.users.values())
                .slice(pageInfo.offset, pageInfo.ps);
            
            return Promise.resolve(
                PageBuilder.withPageInfo(pageInfo, items)
                .totalCount(totalCount)
                .build()
            );
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
