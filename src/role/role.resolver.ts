import { Inject } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { ResolverFactory } from 'base/base.resolver.factory'
import { Role } from './role.entity'
import { RoleService } from './role.service'
@Resolver(() => Role)
export class RoleResolver extends ResolverFactory(Role) {
  @Inject() service: RoleService
}
