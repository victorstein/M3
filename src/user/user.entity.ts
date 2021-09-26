import { Field, ID, ObjectType } from '@nestjs/graphql'
import { modelOptions, Ref, prop } from '@typegoose/typegoose'
import Base from 'base/base.entity'
import { Role } from 'role/role.entity'

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
export class User extends Base {
  @Field(() => ID)
  id: string

  @Field()
  @prop({ required: true })
  firstName: string

  @Field()
  @prop({ required: true })
  lastName: string

  @Field({ nullable: false })
  @prop({ required: true, lowercase: true })
  email: string

  @prop({ required: true })
  password: string

  @Field(() => Role)
  @prop({ ref: () => Role, required: true })
  role: Ref<Role>

  @prop({ default: 0 })
  tokenVersion: number

  @prop({ default: 0 })
  lastSigned: number

  // Used to invalidate the password reset link in case it hasn't expired but has been used
  @prop({ default: 0 })
  passwordRecoveryVersion: number

  @Field()
  @prop({ default: false })
  emailVerified: boolean

  public get fullName (): string {
    return `${this.firstName} ${this.lastName}`
  }
}
