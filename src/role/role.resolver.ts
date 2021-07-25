import { Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './role.entity';
import { Roles } from './types/roleTypes';

@Resolver(() => Role)
export class RoleResolver {
  @InjectModel(Role.name) private readonly roleModel: Model<Role>

  @Query(() => String)
  async hello () {
    await this.roleModel.create({ name: 'shit', description: 'shit 2', type: Roles.USER })
    return 'world'
  }
}
