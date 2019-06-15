import { ICacheService } from "../../services";

import * as redis from 'redis';

export class RedisCacheService implements ICacheService {

    private client: redis.RedisClient;

    constructor(
        opts: redis.ClientOpts,
        private ns: string = 'tz.co.tapitup.login-cache') {
            this.client = new redis.RedisClient(opts);
        }

    set(key: string, value: any): Promise<boolean> {
        return Promise.resolve(
            this.client.hset(this.ns, key, value));
    }

    get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.hget(this.ns, key, (err, reply: string) => {
                if (err) return reject( err );
                // return reply
                resolve(JSON.parse(reply));
            });
        });
    }

    has(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.hexists(this.ns, key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply === 1);
            });
        });
    }

    delete(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.hdel(this.ns, key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply === 1);
            });
        });
    }

    deleteAll(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.hdel(this.ns, (err, reply) => {
                if (err) return reject(err);
                resolve(reply === 1);
            });
        });
    }

    size(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.client.hlen(this.ns, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            })
        });
    }

}