import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'auth/auth.service'
import { Request } from 'express'
import { mock } from 'jest-mock-extended'
import { JWTCookieStrategy } from './jwt-coockie.strategy'
import { UserService } from 'user/user.service'
import { ConfigGetOptions, ConfigService } from '@nestjs/config'
import { DocumentType } from '@typegoose/typegoose'
import { User } from 'user/user.entity'
import { IEnv } from 'env.types'
import { LoginFactory } from 'auth/loginStrategies/login.factory'
import { TokenFactory } from 'auth/tokenStrategies/token.factory'

const logger = mock<Logger>()
const req = mock<Request>()
const userService = mock<UserService>()
const loginFactory = mock<LoginFactory>()
const tokenFactory = mock<TokenFactory>()

const configService = mock<ConfigService<IEnv>>()
configService.get.calledWith('JWT_SECRET' as never, '' as unknown, {} as const as ConfigGetOptions).mockReturnValue('secret')
configService.get.calledWith('JWT_EXP' as never, '' as unknown, {} as const as ConfigGetOptions).mockReturnValue('1s')
configService.get.calledWith('REFRESH_JWT_SECRET' as never, '' as unknown, {} as const as ConfigGetOptions).mockReturnValue('secrets')
configService.get.calledWith('REFRESH_JWT_EXP' as never, '' as unknown, {} as const as ConfigGetOptions).mockReturnValue('2s')

const mockUser = {
  _id: 'userId',
  lastSigned: 0,
  tokenVersion: 0
} as const as DocumentType<User>

userService.findById.mockImplementation(async (id) => id !== mockUser._id ? null : mockUser)

describe('Jwt cookie auth strategy', () => {
  let strategy: JWTCookieStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTCookieStrategy,
        AuthService,
        { provide: ConfigService, useValue: configService },
        { provide: UserService, useValue: userService },
        { provide: LoginFactory, useValue: loginFactory },
        { provide: TokenFactory, useValue: tokenFactory },
        { provide: Logger, useValue: logger }
      ]
    }).compile()

    strategy = module.get<JWTCookieStrategy>(JWTCookieStrategy)
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

    it.todo('Should call the refresh token method if the JWT expired')
    it.todo('Should look for the user with the userId in the payload')
    it.todo('Should return false if the user encoded in the payload doesn\'t exist')
    it.todo('Should return false if the token version in the payload is not the same as the one in the user')
  })

  describe('refresh token', () => {
    it.todo('Should return false if the refreshToken payload is null')
    it.todo('Should look for the user with the userId in the payload')
    it.todo('Should return false if the user in jwt payload doesn\'t match the user in the refresh payload')
    it.todo('Should return false if the user encoded in the payload doesn\'t exist')
    it.todo('Should return false if the token version in the payload is not the same as the one in the user')
    it.todo('Should update the user token version if the Issued at parameter doesn\'t match with the user')
    it.todo('Should return false if the Issued at parameters don\'t match')
  })
})
