import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '비밀번호 (최소 6자)' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user123', description: '사용자 아이디' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  @IsString()
  password: string;
} 