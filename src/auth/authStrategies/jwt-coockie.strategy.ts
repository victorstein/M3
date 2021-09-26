import { Inject, Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { AuthStrategies, CookieNames, cookieOptions, IPayload, JWTErrorTypes } from '../auth.types'
import { Request } from 'express'
import { AuthService } from 'auth/auth.service'
import { UserService } from 'user/user.service'

@Injectable()
export class JWTCookieStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT_COOKIE) {
  @Inject() private readonly authService: AuthService
  @Inject() private readonly userService: UserService
  @Inject() private readonly logger: Logger

  async validate (req: Request): Promise<boolean> {
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
      return await this.refreshTokens(req)
    }

    // If token did not expire validate the token version
    const user = await this.userService.findById(payload.userId)
    if (user === null) {
      this.logger.error('User in payload is invalid')
      return false
    }
    if (user.tokenVersion !== payload.version) {
      this.logger.error('Failed token version validation')
      return false
    }

    return true
  }

  async refreshTokens (req: Request): Promise<boolean> {
    const { refresh } = req.signedCookies
    // validate refresh token authenticity
    const refreshPayload = this.authService.validateToken({ token: refresh, isRefreshToken: true }) as IPayload

    // If any error happened dont authorize
    if (refreshPayload === null) {
      this.logger.error('Refresh token error')
      return false
    }

    const user = await this.userService.findById(refreshPayload.userId)
    if (user === null) {
      this.logger.error('User in payload is invalid')
      return false
    }

    // Token version validation
    if (user.tokenVersion !== refreshPayload.version) {
      this.logger.error('Failed token version validation')
      return false
    }

    // Validate that this is the latest signed token
    if (refreshPayload.iat !== user.lastSigned) {
      this.logger.error('Failed IAT validation')
      await this.userService.updateOneById(refreshPayload.userId, { tokenVersion: user.tokenVersion + 1 })
      return false
    }

    this.logger.verbose('Renewing jwt and refresh token')
    // If the refresh token didn't error out then generate a new token and refresh token
    const newJwt = this.authService.generateToken({ user })
    const newRefresh = this.authService.generateToken({ user, isRefreshToken: true })

    // Get the new Issued at date
    const newIat = this.authService.validateToken({ token: newRefresh, isRefreshToken: true }) as IPayload
    // Save the new Iat unix timestamp in the user for refresh token validation
    await this.userService.updateOneById(newIat.userId, { lastSigned: newIat.iat })

    req.res?.cookie(CookieNames.JWT, newJwt, cookieOptions)
    req.res?.cookie(CookieNames.REFRESH, newRefresh, cookieOptions)

    return true
  }
}
