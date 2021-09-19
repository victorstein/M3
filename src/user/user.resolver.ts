import { Inject } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { ResolverFactory } from 'base/base.resolver.factory'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver extends ResolverFactory(User) {
  @Inject() service: UserService
}
