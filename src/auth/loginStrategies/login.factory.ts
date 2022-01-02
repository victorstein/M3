import { Injectable } from '@nestjs/common'
import { AuthTypes, ILogin } from 'auth/auth.types'
import { EmailAndPasswordAuthStrategy } from './emailAndPassword.strategy'
import { FacebookAuthStrategy } from './facebook.strategy'
import { GoogleAuthStrategy } from './google.strategy'

@Injectable()
export class LoginFactory {
  constructor (
    private readonly emailAndPasswordStrategy: EmailAndPasswordAuthStrategy,
    private readonly googleStrategy: GoogleAuthStrategy,
    private readonly facebookStrategy: FacebookAuthStrategy
  ) {}

  public getLoginStrategy (AuthType: AuthTypes): ILogin {
    if (AuthType === AuthTypes.EMAIL_AND_PASSWORD) {
      return this.emailAndPasswordStrategy
    } else if (AuthType === AuthTypes.GOOGLE) {
      return this.googleStrategy
    } else if (AuthType === AuthTypes.FACEBOOK) {
      return this.facebookStrategy
    } else {
      throw new Error(`The Provided Auth type "${String(AuthType)}" is not valid`)
    }
  }
}
