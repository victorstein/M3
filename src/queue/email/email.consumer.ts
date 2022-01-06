import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EmailService } from 'email/email.service'
import { EmailTypes } from 'email/email.types'
import { Queues } from 'queue/quques.type'
import { UserService } from 'user/user.service'

@Processor(Queues.EMAIL)
export class EmailConsumer {
  constructor (
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly logger: Logger
  ) {}

  @Process(EmailTypes.RESET_PASSWORD)
  async handleResetEmailRequest ({ data: { userId }, id }: Job<{ userId: string }>): Promise<void> {
    try {
      this.logger.debug(`Processor received job: ${id} to send email template ${EmailTypes.RESET_PASSWORD}`)
      const user = await this.userService.findById(userId)
      if (user === null) { throw new Error('Failed to send password recovery email') }

      await this.emailService.sendPasswordResetEmail(user)
      this.logger.debug('Processor Completed the job successfully')
    } catch (error) {
      this.logger.error(error.message)
    }
  }
}
