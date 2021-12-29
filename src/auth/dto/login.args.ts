import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'
import { AuthTypes } from 'auth/auth.types'
import { IsEmail, IsOptional, IsString } from 'class-validator'

registerEnumType(
  AuthTypes,
  {
    name: 'AuthTypes',
    description: 'Authentication types used to grant access to users',
    valuesMap: {
      EMAIL_AND_PASSWORD: {
        description: 'Default value for Auth types'
      }
    }
  }
)

@ArgsType()
export class LoginArgs {
  @Field(() => AuthTypes, { nullable: true })
  authType: AuthTypes = AuthTypes.EMAIL_AND_PASSWORD

  @IsOptional()
  @IsEmail({}, { message: 'The provided email is invalid' })
  @Field({ nullable: true })
  email: string

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  password: string

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  token: string
}
