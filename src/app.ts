import http from 'http';

import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

// load environments
dotenv.config();

const app = express();
app.set('HOST', process.env.HOST || '0.0.0.0');
app.set('PORT', process.env.PORT || 3000);

// Just return the greeting
app.get('/:name', (req: Request, res: Response) => {
    const { name } = req.params;
    res.send(`Hello ${name}`);
});

const server = http.createServer(app);
server.listen(app.get('PORT'), () => {
    console.log('Server is listening port %s...', app.get('PORT'))
});