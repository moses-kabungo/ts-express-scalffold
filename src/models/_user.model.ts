
export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    last_seen_at?: Date;
    created_at: Date;
    updated_at: Date;
}
