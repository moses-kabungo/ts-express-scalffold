import { User, Page, PageBuilder } from "../../models";
import { PaginationInfo } from "../../middlewares";
import { LoginResponse, LoginFail } from "../../models/_login-response.model";
import { SequelizeUser } from "../models-impl/_sequelize-user.model";
import { ICacheService } from "../../services/_cache.service";
import { AbstractUsersService } from "../../services/_abstract-users-service";
import { TokenDecoder } from "../../services/_token-decoder";
import { TokenEncoder } from "../../services/_token-encoder";

export class SequelizeUsersService extends AbstractUsersService {

    constructor(
        private cache: ICacheService,
        public tokenVerifier: TokenEncoder<User> & TokenDecoder<User>,
    ) {
        super(tokenVerifier);
    }

    create(user: User): Promise<string | User> {
        try {
            return SequelizeUser.create(user);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    bulkCreate(users: User[]): Promise<User[]> {
        try {
            return SequelizeUser.bulkCreate(
                users, { returning: true });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    count(): Promise<number> {
        try {
            return SequelizeUser.count();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    findById(id: string | number): Promise<User | null> {
        try {
            return SequelizeUser.findByPk(id);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async findPage(pageInfo: PaginationInfo): Promise<Page<User>> {
        try {
            const { count, rows } = await SequelizeUser.findAndCountAll({
                offset: pageInfo.offset,
                limit: pageInfo.ps
            });
            const page = PageBuilder
                .withPageInfo(pageInfo, rows)
                .totalCount(count)
                .build();
            return Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
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
