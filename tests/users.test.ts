import * as express from 'express';
import * as request from 'supertest';
import * as bodyParser from 'body-parser';

import { IUsersService } from "../src/services";
import { User, Page, PageBuilder } from "../src/models";
import { UsersApi } from '../src/routes';
import { PaginationInfo } from '../src/middlewares/paginator';

class MockUsersService implements IUsersService {

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
            pageInfo.totalCount = totalCount;
            
            const items: User[] = Array
                .from(this.users.values())
                .slice(pageInfo.offset, pageInfo.limit);
            
            return Promise.resolve(
                PageBuilder.withPageInfo(pageInfo, items)
                .build()
            );
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

const payload: User = {
    id: '1',
    name: 'Jason',
    email: 'jason@example.com',
    password: 'very-secret'
};

describe('Mock Users Service', () => {
    let usersService: IUsersService;

    beforeAll(() => {
        usersService = new MockUsersService();
    });

    test('it should be able to store new users', async () => {
        const promise = usersService.create(payload);
        await expect(promise).resolves.toBe(payload);
        await expect(usersService.count()).resolves.toBe(1);
    });
});

describe('Users API', () => {

    const app = express();
    const usersService = new MockUsersService();

    beforeAll(() => {
        const usersApi = new UsersApi(usersService);
        app.use(bodyParser.json());
        app.use(usersApi.init());
    });


    test('it should be able to POST new users', async () => {
        const promise = request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send(payload)
            .then(res => { return res.body; })
        await expect(promise).resolves.toEqual(payload);
        await expect(usersService.count()).resolves.toBe(1);
    });

    test('it should fetch stored user by id', async (done) => {

        await expect(usersService.count()).resolves.toBe(1);

       request(app)
            .get('/1')
            .set('Accept', 'application/json')
            .expect(200, payload, done);
    });

});