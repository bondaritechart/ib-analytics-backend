import { User } from '@prisma/client';

export class AuthPayload {
  accessToken: string;
  user: Omit<User, 'password'>;
}

