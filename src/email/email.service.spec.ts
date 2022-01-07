import { MailerService } from '@nestjs-modules/mailer'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TokenFactory } from 'auth/tokenStrategies/token.factory'
import { mock } from 'jest-mock-extended'
import { EmailService } from './email.service'

describe('EmailService', () => {
  let service: EmailService
  const mockTokenFactory = mock<TokenFactory>()
  const mockMailerService = mock<MailerService>()
  const mockConfigService = mock<ConfigService>()
  const mockLogger = mock<Logger>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: TokenFactory, useValue: mockTokenFactory },
        { provide: MailerService, useValue: mockMailerService },
        { provide: Logger, useValue: mockLogger },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile()

    service = module.get<EmailService>(EmailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
