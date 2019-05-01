import { Request, Response, NextFunction } from 'express';

import { IUsersService } from '../../services';
import { User } from '../../models';


export function createUser(config: { usersService: IUsersService }) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user: User = req.body as User;
        try {
            const data = await config.usersService.create(user);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }
}
