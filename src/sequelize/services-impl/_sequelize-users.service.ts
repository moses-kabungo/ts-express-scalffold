// import * as bcrypt from 'bcrypt';

import { LoginResponse, LoginFail } from "../../models/_login-response.model";
import { ICacheService } from "../../services/_cache.service";
import { AuthService } from "../../services/_auth-service";
import { SequelizeCRUDFacade } from "./_sequelize-crud-facade";
import { JwtTokenVerifier } from "./_jwt-token-verifier";
import { User } from "../../models";

import db from '../models-impl';

export class SequelizeUsersService extends SequelizeCRUDFacade<User> implements AuthService {

    constructor(
        private cache: ICacheService,
        public tokenVerifier: JwtTokenVerifier,
    ) {
        super(db.SequelizeUser);
    }

    jwtEncode(user: User): Promise<string> {
        return this.tokenVerifier.encode(user);
    }

    jwtDecode(token: string): Promise<User | null> {
        return <Promise<User | null>>this.tokenVerifier.decode(token);
    }

    async login(
        loginId: string,
        password: string,
        validator: (hash: string, pwd: string) => Promise<boolean>
    ): Promise<LoginResponse> {
        try {
            const user = await db.SequelizeUser.findOne({
                where: { email: loginId }
            });
            // Reject because we couldn't find record.
            if (user == null) {
                return Promise.reject(new LoginFail('Account not found. `' + loginId + '`', 404));
            }
            // check if password is valid
            const isValid = await validator(password, (<any>user).password);
            console.log(isValid);
            if (isValid) {
                const accessToken = await this.jwtEncode(<any>user);
                await this.cache.set('' + (<any>user).id, user);
                return Promise.resolve({
                    accessToken
                });
            }
            // reject because password is invalid
            return Promise.reject(new LoginFail('Invalid password.', 403));
        } catch (err) {
            return Promise.reject(err);
        }
    }

    logout(userId: string): Promise<boolean> {
        return this.cache.delete(userId);
    }

}
