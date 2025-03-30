import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from './dto/posts.dto';
export declare class PostsService {
    private postsRepository;
    constructor(postsRepository: Repository<Post>);
    create(createPostDto: CreatePostDto, user: User): Promise<Post>;
    findAll(user: User): Promise<Post[]>;
    findOne(id: number, user: User): Promise<Post>;
    update(id: number, updatePostDto: any, user: User): Promise<Post>;
    remove(id: number, user: User): Promise<void>;
}
