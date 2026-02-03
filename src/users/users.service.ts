import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from '../graphql';
import { DEFAULT_USER_ROLE } from '../common/enums/user-role.enum';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput): Promise<SafeUser> {
    await this.assertUniqueFields(input.email, input.username);

    const userCount = await this.prisma.user.count();

    if (input.role && userCount > 0) {
      throw new BadRequestException(
        'Only administrators can assign roles on creation',
      );
    }

    const password = await this.hashPassword(input.password);
    const created = await this.prisma.user.create({
      data: {
        ...input,
        password,
        role: input.role && userCount === 0 ? input.role : DEFAULT_USER_ROLE,
      },
    });

    return this.sanitizeUser(created);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.sanitizeUser(user) : null;
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, input: UpdateUserInput): Promise<SafeUser> {
    if (!Object.keys(input).length) {
      throw new BadRequestException('No fields provided for update');
    }

    const current = await this.prisma.user.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException('User not found');
    }

    if (input.email != null || input.username != null) {
      await this.assertUniqueFields(
        input.email ?? current.email,
        input.username ?? current.username,
        id,
      );
    }

    const payload: Prisma.UserUpdateInput = {};

    if (input.firstName != null) {
      payload.firstName = input.firstName;
    }

    if (input.lastName != null) {
      payload.lastName = input.lastName;
    }

    if (input.username != null) {
      payload.username = input.username;
    }

    if (input.email != null) {
      payload.email = input.email;
    }

    if (input.role != null) {
      payload.role = input.role;
    }

    if (input.avatar != null) {
      payload.avatar = input.avatar;
    }

    if (input.password) {
      payload.password = await this.hashPassword(input.password);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: payload,
    });

    return this.sanitizeUser(updated);
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  comparePassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async assertUniqueFields(
    email: string,
    username: string,
    excludeUserId?: string,
  ): Promise<void> {
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail && existingByEmail.id !== excludeUserId) {
      throw new ConflictException('Email already in use');
    }

    const existingByUsername = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingByUsername && existingByUsername.id !== excludeUserId) {
      throw new ConflictException('Username already in use');
    }
  }

  private sanitizeUser(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    void _password;
    return safeUser;
  }
}
