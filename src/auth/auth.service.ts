import { Inject, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'
import { GenerateTokenArgs, IPayload, JWTErrorTypes, ValidateTokenArgs } from './auth.types'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'env.types'
import { DocumentType } from '@typegoose/typegoose'

@Injectable()
export class AuthService {
  @Inject() userService: UserService
  @Inject() configService: ConfigService<IEnv>
  @Inject() logger: Logger

  async validateUser (email: string, pass: string): Promise<DocumentType<User>> {
    try {
      const user = await this.userService.findOneByParam({ email: email })
      if (user == null) { throw new UnauthorizedException() }

      const validUser = await this.userService.validatePassword(user.password, pass)

      if (!validUser) { throw new UnauthorizedException() }
      return user
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }

  validateToken ({ token, isRefreshToken = false }: ValidateTokenArgs): IPayload | JWTErrorTypes.EXPIRED | null {
    try {
      const environmentSecret = isRefreshToken ? 'REFRESH_JWT_SECRET' : 'JWT_SECRET'
      const secret = this.configService.get(environmentSecret, '')
      return jwt.verify(token, secret) as IPayload
    } catch (error) {
      this.logger.error(error.message)
      if (error.name === JWTErrorTypes.EXPIRED && !isRefreshToken) { return error.name }
      return null
    }
  }

  generateToken ({ user, isRefreshToken = false }: GenerateTokenArgs): string {
    try {
      const environmentSecret = isRefreshToken ? 'REFRESH_JWT' : 'JWT'
      const secret = this.configService.get(`${environmentSecret}_SECRET`, '')
      const expiresIn = this.configService.get(`${environmentSecret}_EXP`, '')

      const payload: IPayload = { version: user.tokenVersion, userId: user._id }
      const token = jwt.sign(payload, secret, { expiresIn })
      return token
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}
