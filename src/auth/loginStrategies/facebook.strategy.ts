import { HttpService } from '@nestjs/axios'
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentType } from '@typegoose/typegoose'
import { Credentials, FacebookUser, ILogin } from 'auth/auth.types'
import { IEnv } from 'env.types'
import { lastValueFrom, map } from 'rxjs'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'
import { SocialLogin } from './social.abstract'

@Injectable()
export class FacebookAuthStrategy extends SocialLogin implements ILogin {
  jwk_uri: string

  constructor (
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly configService: ConfigService<IEnv>,
    private readonly httpService: HttpService
  ) {
    super()
    this.jwk_uri = this.configService.get('FACEBOOK_GRAPH_URI', '')
  }

  async validateToken (token: string): Promise<FacebookUser> {
    try {
      const params = {
        fields: 'id,name,email',
        access_token: token
      }

      const observable = this.httpService
        .get<FacebookUser>(`${this.jwk_uri}/me`, { params })
        .pipe(map(resp => resp.data))

      const data = await lastValueFrom(observable)

      return data
    } catch (error) {
      this.logger.error(error.message)
      throw new UnauthorizedException('invalid token')
    }
  }

  async login ({ token }: Credentials): Promise<DocumentType<User>> {
    try {
      const { email, id } = await this.validateToken(token)

      const user = await this.userService.findOneByParam({ $or: [{ email }, { socialId: id }] })
      if (user == null) { throw new UnauthorizedException() }

      return user
    } catch (error) {
      this.logger.error(error)
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
  }
}
