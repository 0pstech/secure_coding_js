import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt: ${registerDto.email}`);
    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(`Registration successful: ${registerDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Registration failed: ${registerDto.email}`, error.stack);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt: ${loginDto.username}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Login successful: ${loginDto.username}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed: ${loginDto.username}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  async checkAuth() {
    return { message: 'Authentication successful' };
  }
} 