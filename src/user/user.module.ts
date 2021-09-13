import { Logger, Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'role/role.module';
import { buildSchema } from '@typegoose/typegoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: buildSchema(User) }]), RoleModule],
  providers: [Logger, UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
