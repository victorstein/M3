import { Inject, Injectable } from '@nestjs/common'
import { Resolver, Query, Args, Context } from '@nestjs/graphql'
import { LoginArgs } from './dto/login.input.dto'
import { AuthService } from './auth.service'
import { IContext } from 'app.types'
import { CookieNames, cookieOptions, TokenType } from './auth.types'
import { UserService } from 'user/user.service'
import { isMobile } from 'common/utils'

@Resolver()
@Injectable()
export class AuthResolver {
  @Inject() authService: AuthService
  @Inject() userService: UserService

  @Query(() => String, { description: 'Query used to login the user, the backend will determine if the request is mobile or desktop' })
  async login (@Args() loginArgs: LoginArgs, @Context() { req, res }: IContext): Promise<string> {
    const user = await this.authService.authenticateUser(loginArgs)

    // Check if the requester is a mobile device not in a browser
    const mobile = isMobile(req)
    const tokenType = mobile ? TokenType.MOBILE : TokenType.REFRESH
    const iat = mobile ? 'lastSignedMobile' : 'lastSigned'

    const token = this.authService.generateToken({ user })
    const refreshToken = this.authService.generateToken({ user, tokenType })

    // Get the new Issued at date
    const newIat = this.authService.validateToken({ token: refreshToken, tokenType })
    // Save the new Iat unix timestamp in the user for refresh token validation
    await this.userService.updateOneById(newIat.userId, { [iat]: newIat.iat })

    if (mobile) {
      res.setHeader(CookieNames.JWT, token)
      res.setHeader(CookieNames.REFRESH, refreshToken)
    } else {
      res.cookie(CookieNames.JWT, token, cookieOptions)
      res.cookie(CookieNames.REFRESH, refreshToken, cookieOptions)
    }

    return 'login successful'
  }
}
