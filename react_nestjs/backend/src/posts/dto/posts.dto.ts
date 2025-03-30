import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Permission {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class CreatePostDto {
  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '게시글 내용입니다.', description: '게시글 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: Permission, example: Permission.PUBLIC, description: '게시글 권한 설정' })
  @IsEnum(Permission)
  permission: Permission;
}

export class UpdatePostDto {
  @ApiProperty({ example: '수정된 제목', description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '수정된 내용입니다.', description: '게시글 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: Permission, example: Permission.PUBLIC, description: '게시글 권한 설정' })
  @IsEnum(Permission)
  permission: Permission;
} 