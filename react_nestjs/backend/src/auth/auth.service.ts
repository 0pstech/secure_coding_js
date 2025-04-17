import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    console.log('registerDTO : ', registerDto);

    // Vulnerable to SQL injection - duplicate check query using QueryBuilder
    const existingUser = await this.usersRepository
      .createQueryBuilder('user')
      .where(`user.username = '${username}' OR user.email = '${email}'`)
      .getOne();

    if (existingUser) {
      throw new UnauthorizedException('Username or email is already in use.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        password: hashedPassword,
        email,
        isAdmin: false,
        createdAt: () => 'NOW()'
      })
      .execute();

    // Fetch the created user
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where(`user.username = '${username}'`)
      .getOne();

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });

    return {
      message: 'Registration completed successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      },
    };
  }

  async register_safe(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Check for duplicate username and email
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username },
        { email },
      ],
    });

    if (existingUser) {
      throw new UnauthorizedException('Username or email is already in use.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      message: 'Registration completed successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
} 