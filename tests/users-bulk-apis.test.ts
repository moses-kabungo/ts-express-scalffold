import * as express from 'express';
import * as request from 'supertest';
import * as bodyParser from 'body-parser';

import { User } from "../src/models";
import { UsersApi } from '../src/routes/users';
import { MockUsersService } from './mock-users.service';
import { ICacheService } from '../src/services/_cache.service';
import { MockCacheService } from './mock-cache.service';
import { CRUDService } from '../src/services/_crud-service';
import { AuthService } from '../src/services/_auth-service';

describe('Mock bulk create users', () => {
    let usersService: CRUDService<User> & AuthService;
    let cacheService: ICacheService;
    const app = express();
    const users: User[] = [{
        id: 2,
        name: 'Sally',
        email: 'sally@example.com',
        password: 'sally1990',
        require_password_change: false,
    }, {
        id: 3,
        name: 'Doto',
        email: 'doto@example.com',
        password: 'doto1998',
        require_password_change: false,
    }, {
        id: 4,
        name: 'Tom',
        email: 'tom@example.com',
        password: 'tom2001',
        require_password_change: false,
    }, {
        id: 5,
        name: 'Sembe',
        email: 'sembe@example.com',
        password: 'sembe1990',
        require_password_change: false,
    }, {
        id: 6,
        name: 'Diana',
        email: 'diana@example.com',
        password: 'diana1990',
        require_password_change: false,
    }, {
        id: 7,
        name: 'Cece',
        email: 'cece@example.com',
        password: 'cece1990',
        require_password_change: false,
    }, {
        id: 8,
        name: 'Kiboko',
        email: 'kiboko@example.com',
        password: 'kiboko1990',
        require_password_change: false,
    }, {
        id: 9,
        name: 'Namba 1',
        email: 'namba@example.com',
        password: 'namba1990',
        require_password_change: false,
    }, {
        id: 10,
        name: 'Ombeni',
        email: 'ombeni@example.com',
        password: 'ombeni1990',
        require_password_change: false,
    }, {
        id: 11,
        name: 'Mombeki',
        email: 'mombeki@example.com',
        password: 'mombeki1990',
        require_password_change: false,
    }];

    // void(users);

    // beforeAll(() => {
    cacheService = new MockCacheService();
    usersService = new MockUsersService(cacheService);
    const usersApi = new UsersApi(usersService);
    app.use(bodyParser.json());
    app.use(usersApi.init());
    // });

    test('Bulk insert shold insert all users', async (done) => {
        expect(usersService.count()).resolves.toBe(0);
        return request(app)
            .post('/bulk')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(users)
            .expect(async (response) => {
                expect(response.status).toBe(200);
                expect(response.body.length).toEqual(users.length);
                expect(response.body).toEqual(users);
                const count = await usersService.count();
                expect(count).toBe(users.length);
                done();
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    });

    test('View users page should work', () => {
        return request(app)
            .get('/?pi=1&ps=5')
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Sort should work', () => {
        const sortedUsers = users.sort((user1, user2) => {
            if (user1.name < user2.name) {
                return -1;
            } else if (user1.name > user2.name) {
                return 1;
            }
            return 0;
        });


        return request(app)
            .get('/?pi=1&ps=10&sortBy=name&sortOrder=asc')
            .set('Accept', 'application/json')
            .expect((response) => {
                const remoteUsers = response.body;
                expect(response.status).toBe(200);
                for (let i = 0; i < sortedUsers.length; i++) {
                    expect(sortedUsers[i]).toEqual(remoteUsers.items[i]);
                }
            });
    });
});