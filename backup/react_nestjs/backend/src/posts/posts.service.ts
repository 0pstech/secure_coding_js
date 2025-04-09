import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, Permission } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from './dto/posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
      authorId: user.id
    });
    return await this.postsRepository.save(post);
  }

  async findAll(user: User): Promise<Post[]> {
    return this.postsRepository.find({
      where: [
        { permission: Permission.PUBLIC },
        { authorId: user.id }
      ],
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number, user: User): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author']
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.permission === Permission.PRIVATE && post.authorId !== user.id) {
      throw new ForbiddenException('You do not have permission to view this post');
    }

    return post;
  }

  async update(id: number, updatePostDto: any, user: User): Promise<Post> {
    const post = await this.findOne(id, user);

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number, user: User): Promise<void> {
    const post = await this.findOne(id, user);

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
  }
} 