import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { ResolverFactory } from 'base/base.resolver.factory';
import { User } from './user.entity';
import { UserService } from './user.service';

const BaseResolver = ResolverFactory(User);

@Resolver(() => User)
export class UserResolver extends BaseResolver {
  @Inject() service: UserService
}
