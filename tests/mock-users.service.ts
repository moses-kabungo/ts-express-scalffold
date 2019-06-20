import * as jwt from 'jsonwebtoken';

import { User, Page, PageBuilder } from "../src/models";
import { PaginationInfo } from '../src/middlewares/_paginator.middleware';
import { LoginResponse, LoginFail } from "../src/models/_login-response.model";
import { AuthService } from '../src/services/_auth-service';
import { CRUDService } from '../src/services/_crud-service';
import { ICacheService } from '../src/services';

export class MockUsersService implements CRUDService<User>, AuthService {

    public users: Map<string, User>;

    constructor(private cacheService: ICacheService) {
        this.users = new Map();
    }

    count(): Promise<number> {
        return Promise.resolve(this.users.size);
    }

    bulkCreate(users: User[]): Promise<User[]> {
        const result = Promise.resolve(users.map(user => {
            this.users.set(String(user.id), user);
            return user;
        }));

        return result;
    }

    create(user: User): Promise<string | User> {
        this.users.set(String(user.id), user);
        return Promise.resolve(user);
    }
    
    deleteByPk(pk: string | number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    updateByPk(props: { [p: string]: any; }): Promise<number> {
        throw new Error("Method not implemented.");
    }

    findByPk(id: string): Promise<User | null> {
        const exists = this.users.has(id);
        return exists
            ? Promise.resolve(this.users.get(id) as User)
            : Promise.reject(new Error(`No Such User ID: ${id}`));
    }

    jwtEncode(user: User): Promise<string> {
        return new Promise((resolve) => {
            const token = jwt.sign(
                JSON.stringify({ id: user.id }),
                String(process.env.APP_SECRET)
            );
            resolve(token);
        });
    }

    jwtDecode(token: string): Promise<User | null> {
        return new Promise((_, reject) => {
            const data: { id: string } | null = jwt.decode(token) as any;
            if (data == null)
                reject(null);
            return this.findByPk(data!.id);
        });
    }

    login(loginId: string, password: string): Promise<LoginResponse> {
        // Inspect parameters validity
        // If no login ID, return 400 (Invalid Request)
        if (!loginId) {
            return Promise.reject(new LoginFail('Missing login id', 400));
        }

        // If no password, return 400 (Invalid Request)
        if (!password) {
            return Promise.reject(new LoginFail('Missing password', 400));
        }

        // Check if our user exists

        // find User by name
        const users = Array.from(this.users);
        const index = users.findIndex(
            (user) => user[1].email === loginId
        );

        if (index === -1) {
            return Promise.reject(new LoginFail('Invalid username', 404));
        }

        if (users[index][1].password !== password) {
            return Promise.reject(new LoginFail('Invalid password', 400));
        }

        return this.jwtEncode(users[index][1]).then(token => {
            // add to the cache
            this.cacheService.set(String(users[index][1].id), users[index][1]);
            return { accessToken: token };
        });
    }

    logout(userId: string): Promise<boolean> {
        // remove user from the cache 
        return this.cacheService.delete(userId);
    }

    findPage(data: { pageInfo: PaginationInfo }): Promise<Page<User>> {
        return this.count().then(totalCount => {

            let items: User[] = Array.from(this.users.values());
            // sort if necessary
            if (data.pageInfo.sortBy && data.pageInfo.sortOrder) {
                items = items.sort((user1, user2) => {
                    if (data.pageInfo.sortOrder === 'asc') {
                        if (user1.name < user2.name) {
                            return -1;
                        }

                        if (user1.name > user2.name) {
                            return 1;
                        }

                        return 0;
                    } else {
                        if (user1.name < user2.name) {
                            return 1;
                        }

                        if (user1.name > user2.name) {
                            return -1;
                        }

                        return 0;
                    }
                });
            }

            const ret: User[] = items
                .slice(data.pageInfo.offset, data.pageInfo.ps);

            const usersPage: Page<User> = PageBuilder
                .withPageInfo(data.pageInfo, ret)
                .totalCount(totalCount)
                .build();
            return usersPage;
        }).catch(err => Promise.reject(err));
    }
}
