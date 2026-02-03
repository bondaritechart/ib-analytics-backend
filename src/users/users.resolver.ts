import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

type SafeUser = Omit<User, 'password'>;

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  users() {
    return this.usersService.findAll();
  }

  @Query('user')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Query('me')
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: SafeUser) {
    if (!user) {
      return null;
    }
    return this.usersService.findOne(user.id);
  }

  @Mutation('createUser')
  createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }

  @Mutation('updateUser')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUser(@Args('id') id: string, @Args('input') input: UpdateUserInput) {
    return this.usersService.update(id, input);
  }

  @Mutation('deleteUser')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}
