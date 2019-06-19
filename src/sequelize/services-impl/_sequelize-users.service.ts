import { LoginResponse, LoginFail } from "../../models/_login-response.model";
import { SequelizeUser } from "../models-impl/_sequelize-user.model";
import { ICacheService } from "../../services/_cache.service";
import { AuthService } from "../../services/_auth-service";
import { AbstractCRUDFacade } from "./_abstract-crud-facade";
import { JwtTokenVerifier } from "./_jwt-token-verifier";

export class SequelizeUsersService extends AbstractCRUDFacade<SequelizeUser> implements AuthService {

    constructor(
        private cache: ICacheService,
        public tokenVerifier: JwtTokenVerifier,
    ) {
        super();
    }

    jwtEncode(user: SequelizeUser): Promise<string> {
        return this.tokenVerifier.encode(user);
    }

    jwtDecode(token: string): Promise<SequelizeUser | null> {
        return <Promise<SequelizeUser|null>>this.tokenVerifier.decode(token);
    }

    async login(
        loginId: string,
        password: string,
        validator: (hash: string, pwd: string) => Promise<boolean>
    ): Promise<LoginResponse> {
        try {
            const user = await SequelizeUser.findOne({
                where: { email: loginId }
            });
            // Reject because we couldn't find record.
            if (user == null) {
                return Promise.reject(new LoginFail('Account not found. `' + loginId + '`', 404));
            }
            // check if password is valid
            const isValid = await validator(user.password, password);
            if (isValid) {
                const accessToken = await this.jwtEncode(user);
                await this.cache.set('' + user.id, user);
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
