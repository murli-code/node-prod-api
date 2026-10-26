import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
// Import Role enum to type and reference user roles when building the JWT payload
import { Role } from './role/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    // ✅ STEP 1: find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ✅ STEP 2: compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ✅ STEP 3: generate JWT
    // Include `roles` so that authorization guards can read `req.user.roles`.
    // We type the payload here to make the expected shape explicit.
    const payload: { sub: number; email: string; roles: Role[] } = {
      sub: user.id,
      email: user.email,
      roles: user.roles, // roles are persisted on the User entity
    };
    const token = this.jwtService.sign(payload);

    // ✅ STEP 4: remove password before return
    const { password: removedPassword, ...safeUser } = user;
    void removedPassword;
    return { ...safeUser, token };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // Pass plain password — hashing is handled inside UsersService.createUser
    const createdUser = await this.usersService.createUser(registerDto);

    // remove password before return
    const {
      password: removedPassword,
      confirmPassword: removedConfirmPassword,
      ...safeUser
    } = createdUser.data;
    void removedPassword;
    void removedConfirmPassword;

    // ✅ STEP 3: generate JWT
    // Include roles from the created user so callers receive their role claims.
    const payload: { sub: number; email: string; roles: Role[] } = {
      sub: safeUser.id,
      email: safeUser.email,
      // `safeUser` comes from createdUser.data and should include `roles`.
      roles: safeUser.roles || [Role.User],
    };
    const token = this.jwtService.sign(payload);

    return { ...createdUser, data: { ...safeUser, token } };
  }
}
