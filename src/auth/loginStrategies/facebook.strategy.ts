import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentType } from '@typegoose/typegoose'
import { Credentials, FacebookUser, ILogin } from 'auth/auth.types'
import Axios from 'axios'
import { IEnv } from 'env.types'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'
import { SocialLogin } from './socialLogin'

@Injectable()
export class FacebookAuthStrategy extends SocialLogin implements ILogin {
  jwk_uri: string

  constructor (
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly configService: ConfigService<IEnv>
  ) {
    super()
    this.jwk_uri = this.configService.get('FACEBOOK_GRAPH_URI', '')
  }

  async validateToken (token: string): Promise<FacebookUser> {
    try {
      const { data } = await Axios.get<FacebookUser>(`${this.jwk_uri}/me`, {
        params: {
          fields: 'id,name,email',
          access_token: token
        }
      })
      return data
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  async login ({ token }: Credentials): Promise<DocumentType<User>> {
    try {
      const { email, id } = await this.validateToken(token)

      const user = await this.userService.findOneByParam({ $or: [{ email }, { socialId: id }] })
      if (user == null) { throw new UnauthorizedException() }

      return user
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }
}
