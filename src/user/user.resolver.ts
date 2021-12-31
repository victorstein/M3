import { Inject } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { User } from './user.entity'
import { UserService } from './user.service'
import { ResolverFactory } from 'common/base.resolver.factory'

@Resolver(() => User)
export class UserResolver extends ResolverFactory(User) {
  @Inject() service: UserService
}
