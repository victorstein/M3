import { Logger, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { Role } from './role.entity';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Service } from 'base/service.base';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: SchemaFactory.createForClass(Role) }])],
  providers: [RoleService, RoleResolver, Service, Logger],
  exports: [RoleService]
})
export class RoleModule {}
