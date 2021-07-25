import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: SchemaFactory.createForClass(User) }])],
  providers: [UserService, UserResolver]
})
export class UserModule {}
