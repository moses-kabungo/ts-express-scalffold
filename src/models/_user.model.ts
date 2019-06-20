
export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    require_password_change: boolean;
    last_seen_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}
