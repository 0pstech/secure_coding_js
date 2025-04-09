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

    // 사용자 이름과 이메일 중복 체크
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username },
        { email },
      ],
    });

    if (existingUser) {
      throw new UnauthorizedException('이미 사용 중인 사용자 이름 또는 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    // JWT 토큰 생성
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      message: '회원가입이 완료되었습니다.',
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

    // 사용자 찾기
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // JWT 토큰 생성
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      message: '로그인 성공',
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