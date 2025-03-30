import { User } from '../../../entities/user.entity';
import { Permission } from '../dto/posts.dto';
export declare class Post {
    id: number;
    title: string;
    content: string;
    permission: Permission;
    author: User;
    created_at: Date;
    updated_at: Date;
}
