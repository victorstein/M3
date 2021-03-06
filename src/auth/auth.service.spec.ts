import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { mock } from 'jest-mock-extended'
import { UserService } from 'user/user.service'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { LoginFactory } from './loginStrategies/login.factory'
import { TokenFactory } from './tokenStrategies/token.factory'

describe('AuthService', () => {
  let service: AuthService
  const mockUserService = mock<UserService>()
  const mockConfigService = mock<ConfigService>()
  const mockLogger = mock<Logger>()
  const mockLoginFactory = mock<LoginFactory>()
  const mockTokenFactory = mock<TokenFactory>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoginFactory, useValue: mockLoginFactory },
        { provide: TokenFactory, useValue: mockTokenFactory },
        { provide: Logger, useValue: mockLogger }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
