import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthPayload, LoginInput } from '../graphql';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res?: Response },
  ): Promise<AuthPayload> {
    const result = await this.authService.login(input);

    context.res?.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return result;
  }
}
