import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentType } from '@typegoose/typegoose'
import { Credentials, GoogleUser, ILogin } from 'auth/auth.types'
import { IEnv } from 'env.types'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'
import { SocialLogin } from './socialLogin'

@Injectable()
export class GoogleAuthStrategy extends SocialLogin implements ILogin {
  jwk_uri: string

  constructor (
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly configService: ConfigService<IEnv>
  ) {
    super()
    this.jwk_uri = this.configService.get('GOOGLE_JWK_URI', '')
  }

  async login ({ token }: Credentials): Promise<DocumentType<User>> {
    try {
      const { email, sub } = await this.validateToken(token) as GoogleUser
      console.log(await this.validateToken(token))

      const user = await this.userService.findOneByParam({ $or: [{ email }, { socialId: sub }] })
      if (user == null) { throw new UnauthorizedException() }

      return user
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }
}
