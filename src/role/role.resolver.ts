import { Query, Resolver } from '@nestjs/graphql';
import { Role } from './role.entity';
@Resolver(() => Role)
export class RoleResolver {
  @Query(() => String)
  async hello () {
    return 'world'
  }
}
