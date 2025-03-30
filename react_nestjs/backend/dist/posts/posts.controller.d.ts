import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { Request } from 'express';
export declare class PostsController {
    private readonly postsService;
    private readonly logger;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, user: any): Promise<import("../entities/post.entity").Post>;
    findAll(req: Request): Promise<import("../entities/post.entity").Post[]>;
    findOne(id: number, req: Request): Promise<import("../entities/post.entity").Post>;
    update(id: number, updatePostDto: UpdatePostDto, req: Request): Promise<import("../entities/post.entity").Post>;
    remove(id: number, req: Request): Promise<void>;
}
