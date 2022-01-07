import { Inject, Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { AuthStrategies, CookieNames, cookieOptions, IPayload, JWTErrorTypes, TokenType } from '../auth.types'
import { Request } from 'express'
import { AuthService } from 'auth/auth.service'
import { UserService } from 'user/user.service'
import { isMobile } from 'common/utils'

@Injectable()
export class JWTCookieStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT_COOKIE) {
  @Inject() private readonly authService: AuthService
  @Inject() private readonly userService: UserService
  @Inject() private readonly logger: Logger

  async checkIfRefreshable ({ name, message }: Error, req: Request): Promise<boolean> {
    if (name === JWTErrorTypes.EXPIRED) {
      return await this.refreshTokens(req)
    } else {
      this.logger.error(message)
      return false
    }
  }

  getTokens (req: Request): { jwt: string, refresh: string } {
    const credsSource = isMobile(req) ? req.headers : req.signedCookies
    const { jwt, refresh } = credsSource
    return { jwt, refresh }
  }

  async validate (req: Request): Promise<boolean> {
    const { jwt, refresh } = this.getTokens(req)

    // Check if both headers come in the request
    if (jwt === undefined || refresh === undefined) {
      this.logger.error('jwt or refresh cookie missing')
      return false
    }

    let payload: IPayload

    try {
      payload = this.authService.validateToken({ token: jwt })
    } catch (err) {
      return await this.checkIfRefreshable(err, req)
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
    const { refresh } = this.getTokens(req)
    const mobile = isMobile(req)

    const tokenType = mobile ? TokenType.MOBILE : TokenType.REFRESH
    const iat = mobile ? 'lastSignedMobile' : 'lastSigned'

    let refreshPayload
    // validate refresh token authenticity
    try {
      refreshPayload = this.authService.validateToken({ token: refresh, tokenType })
    } catch (err) {
      this.logger.error(`Refresh token: ${String(err.message)}`)
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
    if (refreshPayload.iat !== user[iat]) {
      this.logger.error('Failed IAT validation')
      // If failed IAT validation revoke access to all tokens
      await this.userService.updateOneById(refreshPayload.userId, { tokenVersion: user.tokenVersion + 1 })
      return false
    }

    this.logger.debug('Renewing jwt and refresh token')
    // If the refresh token didn't error out then generate a new token and refresh token
    const newJwt = this.authService.generateToken({ user })
    const newRefresh = this.authService.generateToken({ user, tokenType })

    // Get the new Issued at date
    const newIat = this.authService.validateToken({ token: newRefresh, tokenType })
    // Save the new Iat unix timestamp in the user for refresh token validation
    await this.userService.updateOneById(newIat.userId, { [iat]: newIat.iat })

    if (mobile) {
      req.res?.setHeader(CookieNames.JWT, newJwt)
      req.res?.setHeader(CookieNames.REFRESH, newRefresh)
    } else {
      req.res?.cookie(CookieNames.JWT, newJwt, cookieOptions)
      req.res?.cookie(CookieNames.REFRESH, newRefresh, cookieOptions)
    }

    return true
  }
}
