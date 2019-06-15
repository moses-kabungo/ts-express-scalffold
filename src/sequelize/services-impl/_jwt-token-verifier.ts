import { TokenEncoder, TokenDecoder } from "../../services";
import { User } from "../../models";

import * as jwt from 'jsonwebtoken';

export class JwtTokenVerifier implements TokenEncoder<User>, TokenDecoder<User> {

    encode(data: User): Promise<string> {
        return Promise.resolve(
            jwt.sign(data, String(process.env.APP_SECRET)));
    }

    decode(token: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            try {
                const opts: jwt.DecodeOptions = {
                    json: true
                };
                resolve(<User>jwt.decode(token, opts));
            } catch (err) {
                reject(err);
            }
        });
    }
}
