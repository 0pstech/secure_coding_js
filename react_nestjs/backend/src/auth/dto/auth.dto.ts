import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user123', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  password: string;
} 