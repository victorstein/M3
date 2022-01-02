import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IToken } from 'auth/auth.types'
import { IEnv } from 'env.types'
import { TokenAuth } from './token.abstract'

@Injectable()
export class MobileTokenStrategy extends TokenAuth implements IToken {
  secret: string
  expiration: string

  constructor (
    private readonly configService: ConfigService<IEnv>
  ) {
    super()
    this.secret = this.configService.get('MOBILE_JWT_SECRET', '')
    this.expiration = this.configService.get('MOBILE_JWT_EXP', '')
  }
}
