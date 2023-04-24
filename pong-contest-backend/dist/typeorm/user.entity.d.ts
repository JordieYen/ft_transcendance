export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): void;
}
