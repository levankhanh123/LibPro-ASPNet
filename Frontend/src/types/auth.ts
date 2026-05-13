export interface User {
    id?: string;
    username: string;
    role: string;
    token: string;
    userId?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    data: {
        id?: string;
        userId?: string;
        username: string;
        role: string;
        token: string;
    };
}