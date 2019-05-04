import * as express from 'express';
import * as request from 'supertest';
import * as bodyParser from 'body-parser';

import { IUsersService } from "../src/services";
import { User } from "../src/models";
import { UsersApi } from '../src/routes';
import { MockUsersService } from './mock-users.service';


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