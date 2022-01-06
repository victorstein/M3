import { MailerModule, MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'env.types'
import { resolve } from 'path'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

@Injectable()
class SMTPConfig implements MailerOptionsFactory {
  constructor (
    private readonly configService: ConfigService<IEnv>
  ) {}

  createMailerOptions (): MailerOptions {
    const env = this.configService.get('NODE_ENV')
    const host = this.configService.get('EMAIL_HOST')
    const user = this.configService.get('EMAIL_USER')
    const pass = this.configService.get('EMAIL_PASS')
    const port = env === 'production' ? this.configService.get('EMAIL_SSL_PORT') : this.configService.get('EMAIL_TLS_PORT')
    const domain = this.configService.get('DOMAIN_URL')

    return {
      transport: {
        host,
        port,
        secure: env === 'production',
        auth: { user, pass }
      },
      defaults: {
        from: `"No Reply" <noreply@${String(domain)}>`
      },
      template: {
        dir: resolve(process.cwd(), 'dist/email/templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true }
      }
    }
  }
}

export const EmailConfig = MailerModule.forRootAsync({
  useClass: SMTPConfig
})
