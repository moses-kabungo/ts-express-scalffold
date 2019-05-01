
import { User } from '../models';

export interface IUsersService {
    create(user: User): Promise<string|User>;
}
