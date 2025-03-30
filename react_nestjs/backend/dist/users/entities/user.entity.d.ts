import { Post } from '../../../entities/post.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    posts: Post[];
}
