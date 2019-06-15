import { IUsersService } from "./_users.service";
import { User, Page } from "../models";
import { PaginationInfo } from "../middlewares";
import { TokenEncoder } from "./_token-encoder";
import { TokenDecoder } from "./_token-decoder";
import { LoginResponse } from "../models/_login-response.model";

export abstract class AbstractUsersService implements IUsersService {

    constructor(
        protected tokenVerifier: TokenDecoder<User> & TokenEncoder<User>) {
    }

    jwtEncode(user: User): Promise<string> {
        return this.tokenVerifier.encode(user);
    }

    jwtDecode(token: string): Promise<User | null> {
        return this.tokenVerifier.decode(token);
    }

    abstract create(user: User): Promise<string | number | User>;

    abstract bulkCreate(users: User[]): Promise<(string | User)[]>;

    abstract count(): Promise<number>;


    abstract findById(id: string | number): Promise<User | null>;

    abstract findPage(pageInfo: PaginationInfo): Promise<Page<User>>;

    abstract login(
        loginId: string,
        password: string,
        validator: (hash: string, pwd: string) => Promise<boolean>
    ): Promise<LoginResponse>;

    abstract logout(userId: string): Promise<boolean>;
}