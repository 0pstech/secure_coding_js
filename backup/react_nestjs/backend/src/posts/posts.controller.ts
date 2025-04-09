import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Logger, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { User as UserDecorator } from '../decorators/user.decorator';

@ApiTags('게시글')
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 작성' })
  @ApiResponse({ status: 201, description: '게시글 작성 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async create(@Body() createPostDto: CreatePostDto, @UserDecorator() user: any) {
    this.logger.log(`게시글 작성 시도: ${user.email}`);
    try {
      const result = await this.postsService.create(createPostDto, user);
      this.logger.log(`게시글 작성 성공: ${user.email}`);
      return result;
    } catch (error) {
      this.logger.error(`게시글 작성 실패: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiResponse({ status: 200, description: '게시글 목록 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async findAll(@Req() req: Request) {
    this.logger.log('게시글 목록 조회 시도');
    try {
      const result = await this.postsService.findAll(req.user as User);
      this.logger.log('게시글 목록 조회 성공');
      return result;
    } catch (error) {
      this.logger.error('게시글 목록 조회 실패', error.stack);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiResponse({ status: 200, description: '게시글 상세 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  async findOne(@Param('id') id: number, @Req() req: Request) {
    this.logger.log(`게시글 상세 조회 시도: ${id}`);
    try {
      const result = await this.postsService.findOne(id, req.user as User);
      this.logger.log(`게시글 상세 조회 성공: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`게시글 상세 조회 실패: ${id}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 수정' })
  @ApiResponse({ status: 200, description: '게시글 수정 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
    return this.postsService.update(id, updatePostDto, req.user as User);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({ status: 200, description: '게시글 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.postsService.remove(id, req.user as User);
  }
} 