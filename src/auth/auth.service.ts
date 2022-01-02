import { Injectable, Logger } from '@nestjs/common'
import { GenerateTokenArgs, IPayload, LoginArgs, TokenType, ValidateTokenArgs } from './auth.types'
import { DocumentType } from '@typegoose/typegoose'
import { User } from 'user/user.entity'
import { TokenFactory } from './tokenStrategies/token.factory'
import { LoginFactory } from './loginStrategies/login.factory'

@Injectable()
export class AuthService {
  constructor (
    private readonly tokenFactory: TokenFactory,
    private readonly loginFactory: LoginFactory,
    private readonly logger: Logger
  ) {}

  async authenticateUser ({ authType, ...rest }: LoginArgs): Promise<DocumentType<User>> {
    const authenticator = this.loginFactory.getLoginStrategy(authType)
    const user = await authenticator.login(rest)
    return user
  }

  validateToken ({ token, tokenType = TokenType.JWT }: ValidateTokenArgs): IPayload {
    try {
      const TokenStrategy = this.tokenFactory.getTokenAuthorizer(tokenType)
      return TokenStrategy.validateToken(token)
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }

  generateToken ({ user, tokenType = TokenType.JWT }: GenerateTokenArgs): string {
    try {
      const TokenStrategy = this.tokenFactory.getTokenAuthorizer(tokenType)
      return TokenStrategy.generateToken(user)
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}
