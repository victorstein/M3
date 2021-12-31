import { Inject } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Role } from './role.entity'
import { RoleService } from './role.service'
import { ResolverFactory } from 'common/base.resolver.factory'

@Resolver(() => Role)
export class RoleResolver extends ResolverFactory(Role) {
  @Inject() service: RoleService
}
