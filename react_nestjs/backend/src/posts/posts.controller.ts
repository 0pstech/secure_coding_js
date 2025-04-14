import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Logger, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { User as UserDecorator } from '../decorators/user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async create(@Body() createPostDto: CreatePostDto, @UserDecorator() user: any) {
    this.logger.log(`Attempting to create post: ${user.email}`);
    try {
      const result = await this.postsService.create(createPostDto, user);
      this.logger.log(`Post created successfully: ${user.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create post: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post list' })
  @ApiResponse({ status: 200, description: 'Post list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async findAll(@Req() req: Request) {
    this.logger.log('Attempting to retrieve post list');
    try {
      const result = await this.postsService.findAll(req.user as User);
      this.logger.log('Post list retrieved successfully - ', JSON.stringify(result[0]));
      return result;
    } catch (error) {
      this.logger.error('Failed to retrieve post list', error.stack);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post details' })
  @ApiResponse({ status: 200, description: 'Post details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: number, @Req() req: Request) {
    this.logger.log(`Attempting to retrieve post details: ${id}`);
    try {
      const result = await this.postsService.findOne(id, req.user as User);
      this.logger.log(`Post details retrieved successfully: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve post details: ${id}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiResponse({ status: 403, description: 'Permission denied' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
    return this.postsService.update(id, updatePostDto, req.user as User);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiResponse({ status: 403, description: 'Permission denied' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.postsService.remove(id, req.user as User);
  }
} 