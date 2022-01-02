import { Base } from 'common/base.entity'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { modelOptions, Ref, prop } from '@typegoose/typegoose'
import { AuthTypes } from 'auth/auth.types'
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

  @Field(() => Role)
  @prop({ ref: () => Role, required: true })
  role: Ref<Role>

  @Field({ description: 'Used to check if the user has verified the registered email' })
  @prop({ default: false })
  emailVerified: boolean

  @Field(() => AuthTypes, { nullable: false, description: 'Used to determined how the user signed up' })
  @prop({ required: true, enum: AuthTypes })
  signupType: AuthTypes

  // Used to blacklist tokens that were invalidated by password change or IAT validation failure
  @prop({ default: 0 })
  tokenVersion: number

  // Used to determine that last time a refresh token was signed
  @prop({ default: 0 })
  lastSigned: number

  // Used to determine that last time a mobile refresh token was signed
  @prop({ default: 0 })
  lastSignedMobile: number

  // Used to invalidate the password reset link in case it hasn't expired but has been used
  @prop({ default: 0 })
  passwordRecoveryVersion: number

  // Unique identifier provided by the social network used to signup
  @prop({ required: false, index: true })
  socialId: string

  @prop({ required: true })
  password: string

  public get fullName (): string {
    return `${this.firstName} ${this.lastName}`
  }
}
