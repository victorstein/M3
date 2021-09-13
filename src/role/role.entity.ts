import { Field, ID, ObjectType } from '@nestjs/graphql'
import Base from 'base/base.entity'
import { Roles } from './types/role.types'
import { modelOptions, prop } from '@typegoose/typegoose'

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
export class Role extends Base {
  @Field(() => ID)
  id: string

  @Field({ nullable: false })
  @prop({ required: true })
  name: string

  @prop({ required: true, enum: Roles, index: true, immutable: true })
  type: Roles

  @Field()
  @prop({ required: true })
  description: string
}
