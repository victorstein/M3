import { Inject, Injectable } from '@nestjs/common'
import { ResolveField, Query, Root, Resolver } from '@nestjs/graphql'
import { UserService } from 'user/user.service'
import Base from './base.entity'
import { Service } from './base.service'
import { AbstractConstructor, Constructor, BaseResolver } from './base.types'

export const ResolverFactory = <T>(Entity: Constructor<T>): AbstractConstructor<BaseResolver<T>> => {
  const entityName = Entity.name

  @Injectable()
  @Resolver(() => Base)
  abstract class BaseResolver {
    @Inject() userService: UserService
    abstract readonly service: Service<T>
  
    @Query(() => [Entity], { name: `getAll${entityName}s`, nullable: true })
    async getAll () {
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