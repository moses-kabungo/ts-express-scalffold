import { User } from "./_user.model";

export interface LoginSuccess {
    accessToken: string;
}

export class LoginFail extends Error {
    constructor(public message: string, public code: number) {
        super(message);
    }
};

export type LoginResponse = LoginSuccess
    | User
    | LoginSuccess & User
    | LoginFail
