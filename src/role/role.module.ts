import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { Role } from './role.entity';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Role', schema: SchemaFactory.createForClass(Role) }])
  ],
  providers: [RoleService, RoleResolver]
})
export class RoleModule {}
