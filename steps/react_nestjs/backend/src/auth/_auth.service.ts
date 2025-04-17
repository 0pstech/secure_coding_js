import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

  private ecdh = crypto.createECDH('secp256k1');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.ecdh.generateKeys();
  }

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

  /**
   * Returns the server's ECDH public key in Base64 format.
   */
  getServerPublicKey(): string {
    return this.ecdh.getPublicKey('base64');
  }

  /**
   * Computes a shared secret from the client's Base64-encoded public key
   * and returns it as a Base64 string.
   */
  computeSharedSecret(clientPubKeyB64: string): Buffer {
    const clientPubKey = Buffer.from(clientPubKeyB64, 'base64');
    const sharedSecret = this.ecdh.computeSecret(clientPubKey);
    return sharedSecret;
  }

  /**
   * Decrypts a Base64-encoded AES-GCM ciphertext using the shared secret as key.
   * @param sharedSecret - Buffer from computeSharedSecret (32 bytes)
   * @param ivB64 - Base64 IV used during encryption
   * @param encryptedDataB64 - Base64 ciphertext with auth tag appended
   * @returns Decrypted plaintext string
   */
  decryptMessage(
    sharedSecret: Buffer,
    ivB64: string,
    encryptedDataB64: string,
  ): string {
    const iv = Buffer.from(ivB64, 'base64');
    const encryptedBuffer = Buffer.from(encryptedDataB64, 'base64');

    // Separate auth tag (last 16 bytes) from ciphertext
    const authTag = encryptedBuffer.slice(-16);
    const ciphertext = encryptedBuffer.slice(0, -16);

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      sharedSecret,
      iv,
    );
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString('utf-8');
  }

} 