import { User } from 'user/user.entity'
import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

@ObjectType()
@Schema({ timestamps: true })
export class Base {
  @Field(() => User, { nullable: true })
  @Prop({ ref: 'User', required: false, type: mongoose.Schema.Types.ObjectId })
  createdBy: User

  @Field(() => User, { nullable: true })
  @Prop({ ref: 'User', required: false, type: mongoose.Schema.Types.ObjectId })
  lastUpdatedBy: User
}