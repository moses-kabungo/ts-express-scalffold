import { User } from "../models";
import { LoginResponse } from "../models/_login-response.model";

export interface AuthService {
    jwtEncode(user: User): Promise<string>;
    jwtDecode(token: string): Promise<User|null>;

    login(
        loginId: string,
        password: string,
        validator: (hash: string, pwd: string) => Promise<boolean>
    ): Promise<LoginResponse>;
    
    logout(userId: string): Promise<boolean>;
}
