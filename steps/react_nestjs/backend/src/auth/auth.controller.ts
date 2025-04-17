import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common';
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

  // to delete
  @UseGuards(JwtAuthGuard)
  @Get('openai')
  async getAPIKey() {
    return { message: 'it-is-openai-key' };
  }

  @Get('public-key')
  async getPublicKey(): Promise<{ publicKey: string}> {
    return { publicKey: this.authService.getServerPublicKey() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('decrypt')
  async decrypt(
    @Body()
    body: {
      clientPubKey: string;
      iv: string;
      data: string;
    },
  ): Promise<{ decrypted: string; }> {
    // keypair = private, public
    // public enc -> private dec
    // private enc -> public dec
    // server
    // client publickey + My private => aeskey
    // sharedSecret = aesKey
    const sharedSecret = this.authService.computeSharedSecret(body.clientPubKey);
    const decrypted = this.authService.decryptMessage(sharedSecret, body.iv, body.data);
    console.log('Decrypted message: ', decrypted);

    return { decrypted };
  }
  
} 