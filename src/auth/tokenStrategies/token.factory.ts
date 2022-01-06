import { Injectable } from '@nestjs/common'
import { IToken, TokenType } from 'auth/auth.types'
import { EmailTokenStrategy } from './email.token.strategy'
import { JwtTokenStrategy } from './jwt.token.strategy'
import { MobileTokenStrategy } from './mobile.token.strategy'
import { RefreshTokenStrategy } from './refresh.token.strategy'

@Injectable()
export class TokenFactory {
  constructor (
    private readonly jwtTokenStrategy: JwtTokenStrategy,
    private readonly refreshTokenStrategy: RefreshTokenStrategy,
    private readonly mobileTokenStrategy: MobileTokenStrategy,
    private readonly emailTokenStrategy: EmailTokenStrategy
  ) {}

  getTokenAuthorizer (tokenType: TokenType): IToken {
    if (tokenType === TokenType.JWT) {
      return this.jwtTokenStrategy
    } else if (tokenType === TokenType.REFRESH) {
      return this.refreshTokenStrategy
    } else if (tokenType === TokenType.MOBILE) {
      return this.mobileTokenStrategy
    } else if (tokenType === TokenType.EMAIL) {
      return this.emailTokenStrategy
    } else {
      throw new Error(`The token type "${String(tokenType)}" is not valid`)
    }
  }
}
