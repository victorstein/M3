import { BullModule } from '@nestjs/bull'
import { Logger, Module } from '@nestjs/common'
import { EmailModule } from 'email/email.module'
import { UserModule } from 'user/user.module'
import { EmailConsumer } from './email/email.consumer'
import { EmailProducer } from './email/email.producer'
import { Queues } from './quques.type'

@Module({
  imports: [
    BullModule.registerQueue({ name: Queues.EMAIL }),
    UserModule,
    EmailModule
  ],
  providers: [
    EmailProducer,
    EmailConsumer,
    Logger
  ],
  exports: [EmailProducer]
})
export class QueueModule {}
