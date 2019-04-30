import http from 'http';

import dotenv from 'dotenv';
import express from 'express';


// load environments
dotenv.config();

const app = express();
app.set('HOST', process.env.HOST || '0.0.0.0');
app.set('PORT', process.env.PORT || 3000);

const server = http.createServer(app);
server.listen(app.get('PORT'), () => {
    console.log('Server is listening port %s...', app.get('PORT'))
});