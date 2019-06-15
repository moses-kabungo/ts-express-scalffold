import * as express from 'express';
import * as request from 'supertest';
import * as bodyParser from 'body-parser';

import { IUsersService } from "../src/services";
import { User } from "../src/models";
import { UsersApi } from '../src/routes';
import { MockUsersService } from './mock-users.service';
import { ICacheService } from '../src/services/_cache.service';
import { MockCacheService } from './mock-cache.service';

const payload: User = {
    id: 1,
    name: 'Jason',
    email: 'jason@example.com',
    password: 'very-secret'
};


describe('Mock Users Service', () => {
    let usersService: IUsersService;
    let cacheService: ICacheService;

    beforeAll(() => {
        cacheService = new MockCacheService();
        usersService = new MockUsersService(cacheService);
    });

    test('it should be able to store new users', async () => {
        const promise = usersService.create(payload);
        await expect(promise).resolves.toBe(payload);
        await expect(usersService.count()).resolves.toBe(1);
    });
});

describe('Users API', () => {

    const app = express();
    const cacheService = new MockCacheService();
    const usersService = new MockUsersService(cacheService);

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

    test('login should return 200 response, access token and store user in the cache', () => {
        return request(app)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ loginId: payload.email, password: payload.password })
            .expect(async (response) => {
                expect(response.status).toEqual(200);
                expect(response.body.accessToken).toBeDefined();
                expect(await cacheService.get(String(payload.id))).toEqual(payload);
            });
    });

    test('login should fail with 404 if invalid credentials are given', async () => {
        await request(app)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ loginId: 'anon@example.com', password: 'hello' })
            .expect((response) => {
                expect(response.status).toEqual(404);
                expect(response.body.error).toMatch(/invalid/i);
            });

        await request(app)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ loginId: payload.email, password: 'wrong-password' })
            .expect((response) => {
                expect(response.status).toEqual(400);
                expect(response.body.error).toMatch(/invalid/i);
            });
    });

    test('login should fail with 400 if no login id or password is given', async () => {
        await request(app)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ loginId: '', password: '' })
            .expect((response) => {
                expect(response.status).toEqual(400);
                expect(response.body.error).toMatch(/missing/i);
            });

        await request(app)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ loginId: undefined, password: undefined })
            .expect((response) => {
                expect(response.status).toEqual(400);
                expect(response.body.error).toMatch(/missing/i);
            });

        await request(app)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ loginId: payload.email })
            .expect((response) => {
                expect(response.status).toEqual(400);
                expect(response.body.error).toMatch(/missing/i);
            });
    });

    test('logout should logout user and clear cache', async () => {
        await request(app)
            .post('/' + payload.id + '/logout')
            .set('Accept', 'application/json')
            .expect(async (response) => {
                expect(response.status).toEqual(200);
                expect(response.body.successful).toBe(true);
                expect(await cacheService.get(String(payload.id))).toBeUndefined();
            });
    });

});
