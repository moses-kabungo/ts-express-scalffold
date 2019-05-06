import { User } from "./_user.model";

export interface AccessTokenPayload {
    accessToken: string;
}

export type LoginResponse = AccessTokenPayload
    | User
    | AccessTokenPayload & User
    | undefined;
