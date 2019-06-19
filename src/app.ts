import dotenv from 'dotenv';
import http from 'http';

import express from 'express';
import * as bodyParser from 'body-parser';

import { api } from './routes';
import { RedisCacheService } from './sequelize/services-impl/_redis-cache-service';
import { JwtTokenVerifier } from './sequelize/services-impl/_jwt-token-verifier';


// load variables
const res = dotenv.config({
    debug: true
});

if (res.error) {
    throw res.error;
} else {
    console.log(res.parsed);
}

const app = express();
app.set('HOST', process.env.HOST || '0.0.0.0');
app.set('PORT', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cacheService = new RedisCacheService({});
const tokenVerifier = new JwtTokenVerifier();

// initialize models
import('./sequelize/models-impl').then(_ => {
    console.log("Initialized Database");
});

app.use((req, _, next) => {
    console.log(req.method + ' ' + req.url);
    next();
});

app.use('/api', api(cacheService, tokenVerifier));

const server = http.createServer(app);
server.listen(app.get('PORT'), () => {
    console.log('Server is listening port %s...', app.get('PORT'))
});