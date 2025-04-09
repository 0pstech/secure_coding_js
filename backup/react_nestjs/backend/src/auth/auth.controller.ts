import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`회원가입 시도: ${registerDto.email}`);
    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(`회원가입 성공: ${registerDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`회원가입 실패: ${registerDto.email}`, error.stack);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`로그인 시도: ${loginDto.username}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`로그인 성공: ${loginDto.username}`);
      return result;
    } catch (error) {
      this.logger.error(`로그인 실패: ${loginDto.username}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  async checkAuth() {
    return { message: '인증 성공' };
  }
} 