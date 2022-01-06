import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EmailTypes } from 'email/email.types'
import { ObjectId } from 'mongoose'
import { Queues } from '../quques.type'

@Injectable()
export class EmailProducer {
  constructor (
    @InjectQueue(Queues.EMAIL) private readonly emailQueue: Queue,
    private readonly logger: Logger
  ) {}

  async resetPasswordEmail (userId: string | ObjectId): Promise<void> {
    try {
      this.logger.debug('Adding password reset email to queue')
      await this.emailQueue.add(EmailTypes.RESET_PASSWORD, { userId })
      this.logger.debug('Password reset email added to queue successfully')
    } catch (error) {
      this.logger.error(error)
    }
  }
}
