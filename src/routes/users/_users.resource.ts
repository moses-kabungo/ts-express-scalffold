import { Request, Response, NextFunction } from 'express';

import { IUsersService } from '../../services';
import { User } from '../../models';
import { LoginFail } from '../../models/_login-response.model';

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

    /**
     * Perform login. Successful login should cache user data into the cache
     * until when user decides to logout.
     * 
     * @param {Request} req express.Request instance allows the method to access request
     *  context information such as url, method, headers e.t.c.
     * @param {Response} res express.Response instance allow the method to respond to the
     * requested action.
     * @param {NextFunction} next invoke next middleware in the chain e.g. when you need to
     * process errors
     */
    async doLogin(
        req: Request,
        res: Response,
        next: NextFunction) {
        const { loginId, password } = req.body;

        try {
            const loginResponse = await this.usersService
                .login(loginId, password);
            // return login response
            res.json(loginResponse);
        } catch (err) {

            if (err instanceof LoginFail) {
                return res.status(err.code).json({
                    error: err.message
                });
            }

            console.error(err);

            // pass-down unknown error
            next(err);
        }
    }

    /**
     * Perform logout. Successful logout should clear user data from the cache.
     * 
     * @param {Request} req express.Request instance allows the method to access request
     *  context information such as url, method, headers e.t.c.
     * @param {Response} res express.Response instance allow the method to respond to the
     * requested action.
     * @param {NextFunction} next invoke next middleware in the chain e.g. when you need to
     * process errors
     */
    async doLogout(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const successful = await this.usersService.logout(id);
            res.status(successful ? 200 : 500).json({ successful });
        } catch (err) {
            next(err);
        }
    }
}
