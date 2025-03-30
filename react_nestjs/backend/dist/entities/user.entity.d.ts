import { Post } from './post.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    posts: Post[];
}
