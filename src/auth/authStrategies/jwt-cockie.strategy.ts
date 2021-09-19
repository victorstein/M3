import { Inject, Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { AuthStrategies, CookieNames, IPayload, JWTErrorTypes } from '../auth.types'
import { CookieOptions } from 'express'
import { AuthService } from 'auth/auth.service'
import { UserService } from 'user/user.service'

@Injectable()
export class JWTCookieStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT_COOKIE) {
  @Inject() private readonly authService: AuthService
  @Inject() private readonly userService: UserService
  @Inject() private readonly logger: Logger

  async validate (req: any): Promise<boolean> {
    const { jwt, refresh } = req.signedCookies

    // Check if both headers come in the request
    if (jwt === undefined || refresh === undefined) {
      this.logger.error('jwt or refresh cookie missing')
      return false
    }

    // Check if JWT is valid
    const payload = this.authService.validateToken({ token: jwt })

    // If any error happened but expiration
    if (payload === null) {
      this.logger.verbose('JWT error')
      return false
    }

    // If token expired refresh the token
    if (payload === JWTErrorTypes.EXPIRED) {
      // validate refresh token authenticity
      const refreshPayload = this.authService.validateToken({ token: refresh, isRefreshToken: true }) as IPayload

      // If any error happened dont authorize
      if (refreshPayload === null) {
        this.logger.error('Refresh token error')
        return false
      }

      const user = await this.userService.findById(refreshPayload.user)
      if (user === null) { return false }

      this.logger.verbose('Renewing refresh token')
      // If the refresh token didn't error out then generate a new token and refresh token
      const newJwt = this.authService.generateToken({ user })
      const newRefresh = this.authService.generateToken({ user, isRefreshToken: true })

      const options: CookieOptions = { signed: true, httpOnly: true, secure: true, sameSite: true }

      req.res.cookie(CookieNames.JWT, newJwt, options)
      req.res.cookie(CookieNames.REFRESH, newRefresh, options)
    }

    return true
  }
}
