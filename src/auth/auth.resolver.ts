import { Inject, Injectable } from '@nestjs/common'
import { Resolver, Query, Args, Context } from '@nestjs/graphql'
import { LoginArgs } from './dto/login.args'
import { AuthService } from './auth.service'
import { IContext } from 'app.types'
import { CookieNames } from './auth.types'

@Resolver()
@Injectable()
export class AuthResolver {
  @Inject() authService: AuthService

  @Query(() => String)
  async login (@Args() { email, password }: LoginArgs, @Context() { res }: IContext): Promise<string> {
    const user = await this.authService.validateUser(email, password)

    const token = await this.authService.generateToken({ user })
    const refreshToken = await this.authService.generateToken({ user, isRefreshToken: true })
    res.cookie(CookieNames.JWT, token, { httpOnly: true, sameSite: true, signed: true, secure: true })
    res.cookie(CookieNames.REFRESH, refreshToken, { httpOnly: true, sameSite: true, signed: true, secure: true })
    return 'login successful'
  }
}
