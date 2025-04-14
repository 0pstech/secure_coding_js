import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Permission {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class CreatePostDto {
  @ApiProperty({ example: 'Post Title', description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Post content', description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: Permission, example: Permission.PUBLIC, description: 'Post permission setting' })
  @IsEnum(Permission)
  permission: Permission;
}

export class UpdatePostDto {
  @ApiProperty({ example: 'Updated Title', description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Updated content', description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: Permission, example: Permission.PUBLIC, description: 'Post permission setting' })
  @IsEnum(Permission)
  permission: Permission;
} 