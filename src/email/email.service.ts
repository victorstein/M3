import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentType } from '@typegoose/typegoose'
import { TokenType } from 'auth/auth.types'
import { TokenFactory } from 'auth/tokenStrategies/token.factory'
import { IEnv } from 'env.types'
import { User } from 'user/user.entity'
import { EmailTypes } from './email.types'

@Injectable()
export class EmailService {
  constructor (
    private readonly logger: Logger,
    private readonly tokenFactory: TokenFactory,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<IEnv>
  ) {}

  async sendPasswordResetEmail (user: DocumentType<User>): Promise<void> {
    try {
      const tokenGenerator = this.tokenFactory.getTokenAuthorizer(TokenType.EMAIL)
      const hash = tokenGenerator.generateToken(user)

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Reset',
        template: `${EmailTypes.RESET_PASSWORD}.hbs`,
        context: {
          FULL_NAME: user.fullName,
          RESET_LINK: `${String(this.configService.get('DOMAIN_URL'))}/password-reset?hash=${String(hash)}`
        }
      })

      this.logger.debug('Email sent successfully')
    } catch ({ message }) {
      this.logger.error(`Error sending reset password email. ${message as string}`)
      throw new Error(message)
    }
  }
}
