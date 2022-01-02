import { Injectable } from '@nestjs/common'
import { IToken, TokenType } from 'auth/auth.types'
import { JwtTokenStrategy } from './jwt.token.strategy'
import { MobileTokenStrategy } from './mobile.token.strategy'
import { RefreshTokenStrategy } from './refresh.token.strategy'

@Injectable()
export class TokenFactory {
  constructor (
    private readonly jwtTokenStrategy: JwtTokenStrategy,
    private readonly refreshTokenStrategy: RefreshTokenStrategy,
    private readonly mobileTokenStrategy: MobileTokenStrategy
  ) {}

  getTokenAuthorizer (tokenType: TokenType): IToken {
    if (tokenType === TokenType.JWT) {
      return this.jwtTokenStrategy
    } else if (tokenType === TokenType.REFRESH) {
      return this.refreshTokenStrategy
    } else if (tokenType === TokenType.MOBILE) {
      return this.mobileTokenStrategy
    } else {
      throw new Error(`The token type "${String(tokenType)}" is not valid`)
    }
  }
}
