import { User } from './user.entity';
export declare enum Permission {
    PUBLIC = "public",
    PRIVATE = "private"
}
export declare class Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    permission: Permission;
    createdAt: Date;
    updatedAt: Date;
    author: User;
}
