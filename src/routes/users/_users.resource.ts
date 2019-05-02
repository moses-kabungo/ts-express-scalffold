import { Request, Response, NextFunction } from 'express';

import { IUsersService } from '../../services';
import { User } from '../../models';

/**
 * Users resource. 
 */
export class UsersResource {

    /**
     * Initialize Users resource.
     * 
     * the constructor allow change of underlaying data storage service without
     * affecting the source code. Client code must provide an implementation of
     * `IUsersService`.
     * 
     * @param {IUsersService} usersService user storage service interface. 
     */
    constructor(private usersService: IUsersService) { }

    /**
     * Create new `User` resource.
     * @param {Request} req express.Request instance allows the method to access request
     *  context information such as url, method, headers e.t.c.
     * @param {Response} res express.Response instance allow the method to respond to the
     * requested action.
     * @param {NextFunction} next invoke next middleware in the chain e.g. when you need to
     * process errors
     */
    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const user: User = req.body as User;
        try {
            const data = await this.usersService.create(user);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get user resource by id. Returns HTTP Response 404 if user with the given id does not
     * exist.
     * 
     * @param {Request} req express.Request instance allows the method to access request
     *  context information such as url, method, headers e.t.c.
     * @param {Response} res express.Response instance allow the method to respond to the
     * requested action.
     * @param {NextFunction} next invoke next middleware in the chain e.g. when you need to
     * process errors
     */
    async getById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { id } = req.params;
        try {
            const user = await this.usersService.findById(id);
            if (!user) {
                return res.status(404).json({
                    error: `No user with such an id. id=${id}`
                });
            }
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
}
