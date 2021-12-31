import { Field, ID, ObjectType } from '@nestjs/graphql'
import { modelOptions, prop } from '@typegoose/typegoose'
import { Roles } from './types/role.types'
import { Base } from 'common/base.entity'

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
