import { ArgsType, Field } from '@nestjs/graphql'
import { IsEmail, IsString } from 'class-validator'

@ArgsType()
export class LoginArgs {
  @IsEmail({}, { message: 'The provided email is invalid' })
  @Field({ nullable: false })
  email: string

  @Field({ nullable: false })
  @IsString()
  password: string
}
