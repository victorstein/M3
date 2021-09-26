import { forwardRef, Logger, Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleResolver } from './role.resolver'
import { Role } from './role.entity'
import { MongooseModule } from '@nestjs/mongoose'
import { buildSchema } from '@typegoose/typegoose'
import { UserModule } from 'user/user.module'
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: buildSchema(Role) }]), forwardRef(() => UserModule)],
  providers: [RoleService, RoleResolver, Logger],
  exports: [RoleService]
})
export class RoleModule {}
