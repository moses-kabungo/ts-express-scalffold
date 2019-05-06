import Bluebird from 'bluebird';
import jwt from 'jsonwebtoken';

import { User, Page, PageBuilder } from "../src/models";
import { PaginationInfo } from '../src/middlewares/_paginator.middleware';
import { IUsersService } from "../src/services";
import { ICacheService } from "../src/services/_cache.service";
import { LoginResponse } from "../src/models/_login-response.model";

global.Promise = Bluebird;

const resolve = Bluebird.resolve;
const reject = Bluebird.reject;

export class MockUsersService implements IUsersService {

    private users: Map<string, User>;

    constructor(private cacheService: ICacheService) {
        this.users = new Map();
    }

    count(): Bluebird<number> {
        return resolve(this.users.size);
    }

    create(user: User): Bluebird<string | User> {
        this.users.set(user.id, user);
        return resolve(user);
    }

    findById(id: string): Bluebird<User | undefined> {
        const exists = this.users.has(id);
        return exists
            ? resolve(this.users.get(id))
            : reject(new Error(`No Such User ID: ${id}`));
    }

    jwtEncode(user: User): Bluebird<string> {
        return Bluebird.try(() => {
            const token = jwt.sign(
                JSON.stringify({ id: user.id }),
                String(process.env.APP_SECRET)
            );
            return token;
        });
    }

    jwtDecode(token: string): Bluebird<User | undefined> {
        return new Bluebird(() => {
            const data: { id: string } | null = jwt.decode(token) as any;
            if (data == null)
                reject(null);
            return this.findById(data!.id);
        });
    }

    login(loginId: string, password: string): Bluebird<LoginResponse> {
        // find User by name
        const users = Array.from(this.users);
        const index = users.findIndex(
            (user) => user[1].email === loginId && user[1].password === password
        );

        if (index === -1) {
            return resolve(undefined);
        }

        return this.jwtEncode(users[index][1]).then(token => {
            // add to the cache
            this.cacheService.set(users[index][1].id, users[index][1]);
            return { accessToken: token };
        });
    }

    logout(userId: string): Bluebird<boolean> {
        // remove user from the cache 
        return this.cacheService.delete(userId);
    }

    findPage(pageInfo: PaginationInfo): Bluebird<Page<User>> {
        return this.count().then(totalCount => {
            const items: User[] = Array
                .from(this.users.values())
                .slice(pageInfo.offset, pageInfo.ps);
            const usersPage: Page<User> = PageBuilder
                .withPageInfo(pageInfo, items)
                .totalCount(totalCount)
                .build();
            return usersPage;
        }).catch(err => reject(err));
    }
}
