import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Service } from 'base/service.base';
// import { Role } from 'role/role.entity';
import { RoleModule } from 'role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: SchemaFactory.createForClass(User) }]),
    RoleModule
  ],
  providers: [
    Logger,
    UserService,
    UserResolver,
    Service
  ],
  exports: [UserService]
})
export class UserModule {}
