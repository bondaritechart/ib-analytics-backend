import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const userWithPassword =
      await this.usersService.findByEmailWithPassword(loginInput.email);

    if (!userWithPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.comparePassword(
      loginInput.password,
      userWithPassword.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const cleanUser = await this.usersService.findOne(userWithPassword.id);

    const payload = {
      sub: cleanUser.id,
      email: cleanUser.email,
      role: cleanUser.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: cleanUser,
    };
  }
}

