import { Inject, Injectable } from '@nestjs/common'
import { Resolver, Query, Args, Context } from '@nestjs/graphql'
import { LoginArgs } from './dto/login.args'
import { AuthService } from './auth.service'
import { IContext } from 'app.types'
import { CookieNames, cookieOptions, IPayload } from './auth.types'
import { UserService } from 'user/user.service'

@Resolver()
@Injectable()
export class AuthResolver {
  @Inject() authService: AuthService
  @Inject() userService: UserService

  @Query(() => String)
  async login (@Args() loginArgs: LoginArgs, @Context() { res }: IContext): Promise<string> {
    const user = await this.authService.validateUser(loginArgs);

    const token = this.authService.generateToken({ user })
    const refreshToken = this.authService.generateToken({ user, isRefreshToken: true })

    // Get the new Issued at date
    const newIat = this.authService.validateToken({ token: refreshToken, isRefreshToken: true }) as IPayload
    // Save the new Iat unix timestamp in the user for refresh token validation
    await this.userService.updateOneById(newIat.userId, { lastSigned: newIat.iat })

    res.cookie(CookieNames.JWT, token, cookieOptions)
    res.cookie(CookieNames.REFRESH, refreshToken, cookieOptions)

    return 'login successful'
  }
}
