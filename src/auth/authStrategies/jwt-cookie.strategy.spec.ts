import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'auth/auth.service'
import { Request } from 'express'
import { mock } from 'jest-mock-extended'
import { JWTCookieStrategy } from './jwt-coockie.strategy'
import { UserService } from 'user/user.service'
import { ConfigService } from '@nestjs/config'
import { DocumentType } from '@typegoose/typegoose'
import { User } from 'user/user.entity'
import { IEnv } from 'env.types'

const logger = mock<Logger>()
const req = mock<Request>()
const userService = mock<UserService>()

const configService = mock<ConfigService<IEnv>>()
/* @ts-expect-error */
configService.get.calledWith('JWT_SECRET').mockReturnValue('secret')
/* @ts-expect-error */
configService.get.calledWith('JWT_EXP').mockReturnValue('1s')
/* @ts-expect-error */
configService.get.calledWith('REFRESH_JWT_SECRET').mockReturnValue('secrets')
/* @ts-expect-error */
configService.get.calledWith('REFRESH_JWT_EXP').mockReturnValue('2s')

const mockUser = {
  _id: 'userId',
  lastSigned: 0,
  tokenVersion: 0
} as const as DocumentType<User>

userService.findById.mockImplementation(async (id) => id !== mockUser._id ? null : mockUser)

const wait = async (time: number = 1000): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(resolve, time * 1000)
  })
}

describe('Jwt cookie auth strategy', () => {
  let strategy: JWTCookieStrategy
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTCookieStrategy,
        AuthService,
        { provide: ConfigService, useValue: configService },
        { provide: UserService, useValue: userService },
        { provide: Logger, useValue: logger }
      ]
    }).compile()

    strategy = module.get<JWTCookieStrategy>(JWTCookieStrategy)
    authService = module.get<AuthService>(AuthService)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    req.signedCookies = {
      jwt: 'invalidJwt',
      refresh: 'invalidRefresh'
    }
  })

  describe('validate', () => {
    it('Should return false if the jwt cookie is missing', async () => {
      req.signedCookies = { refresh: '' }
      const valid = await strategy.validate(req)
      expect(valid).toBeFalse()
    })

    it('Should return false if the refresh cookie is missing', async () => {
      req.signedCookies = { jwt: '' }
      const valid = await strategy.validate(req)
      expect(valid).toBeFalse()
    })

    it('Should return false if both the refresh and jwt cookie are missing', async () => {
      req.signedCookies = {}
      const valid = await strategy.validate(req)
      expect(valid).toBeFalse()
    })

    it('Should return false if the payload is null', async () => {
      const valid = await strategy.validate(req)
      expect(valid).toBeFalse()
    })

    it('Should call the refresh token method if the JWT expired', async () => {
      req.signedCookies.jwt = authService.generateToken({ user: mockUser })
      req.signedCookies.refresh = authService.generateToken({ user: mockUser, isRefreshToken: true })

      // Wait for jwt token to expire
      await wait(4)

      strategy.refreshTokens = jest.fn()
      await strategy.validate(req)
      expect(strategy.refreshTokens).toHaveBeenCalledWith(req)
    })

    it('Should look for the user with the userId in the payload', async () => {
      req.signedCookies.jwt = authService.generateToken({ user: mockUser })
      req.signedCookies.refresh = authService.generateToken({ user: mockUser, isRefreshToken: true })

      await strategy.validate(req)
      expect(userService.findById).toHaveBeenCalledWith(mockUser._id)
    })

    it('Should return false if the user encoded in the payload doesn\'t exist', async () => {
      req.signedCookies.jwt = authService
        .generateToken({ user: { ...mockUser, _id: 'invalidUserId' } as const as DocumentType<User> })
      req.signedCookies.refresh = authService.generateToken({ user: mockUser, isRefreshToken: true })

      const valid = await strategy.validate(req)
      expect(valid).toBeFalse()
    })

    it('Should return false if the token version in the payload is not the same as the one in the user', async () => {
      req.signedCookies.jwt = authService
        .generateToken({ user: { ...mockUser, tokenVersion: 1 } as const as DocumentType<User> })
      req.signedCookies.refresh = authService.generateToken({ user: mockUser, isRefreshToken: true })

      const valid = await strategy.validate(req)
      expect(valid).toBeFalse()
    })
  })

  describe('refreshtoken', () => {
    it('Should return false if the refreshToken payload is null', () => {})
    it('Should look for the user with the userId in the payload', () => {})
    it('Should return false if the user encoded in the payload doesn\'t exist', () => {})
    it('Should return false if the token version in the payload is not the same as the one in the user', () => {})
    it('Should update the user token version if the Issued at parameter doesn\'t match with the user', () => {})
    it('Should return false if the Issued at parameters don\'t match', () => {})
  })
})
