import { Inject, Injectable, UseGuards } from '@nestjs/common'
import { ResolveField, Query, Root, Resolver } from '@nestjs/graphql'
import { JWTCookieGuard } from 'auth/authStrategies/jwt-cookie.guard'
import { UserService } from 'user/user.service'
import { Service } from './base.service'
import { AbstractConstructor, Constructor, BaseResolver } from './base.types'
import { Base } from './base.entity'

export const ResolverFactory = <T>(Entity: Constructor<T>): AbstractConstructor<BaseResolver<T>> => {
  const entityName = Entity.name

  @Injectable()
  @Resolver(() => Base, { isAbstract: true })
  abstract class BaseResolver {
    @Inject() userService: UserService
    abstract readonly service: Service<T>

    @UseGuards(JWTCookieGuard)
    @Query(() => [Entity], { name: `getAll${entityName}s`, nullable: true })
    async getAll (): Promise<T[] | []> {
      return await this.service.find()
    }

    @ResolveField('createdBy', () => String)
    async createdBy (@Root() root: any): Promise<string> {
      const user = await this.userService.findById(root.createdBy)
      return user?.fullName ?? 'System'
    }
  }

  return BaseResolver
}
