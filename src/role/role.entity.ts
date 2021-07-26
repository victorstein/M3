import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Roles } from './types/roleTypes'
import { Prop, Schema } from '@nestjs/mongoose'

@ObjectType()
@Schema({ timestamps: true })
export class Role {
  @Field(() => ID)
  id: string

  @Field({ nullable: false })
  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: Roles, index: true, immutable: true })
  type: Roles

  @Field()
  @Prop({ required: true })
  description: string
}
