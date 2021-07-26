import { Prop, Schema } from '@nestjs/mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Role } from 'role/role.entity'
import * as mongoose from 'mongoose'

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true })
  firstName: string

  @Field()
  @Prop({ required: true })
  lastName: string

  @Field({ nullable: false })
  @Prop({ required: true, lowercase: true })
  email: string

  @Prop({ required: true })
  password: string

  @Field(() => Role)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
  role: Role

  @Prop({ default: 1 })
  tokenVersion: number

  @Field()
  @Prop({ default: false })
  emailVerified: boolean

  public get fullName (): string {
    return `${this.firstName} ${this.lastName}`
  }
}