import { Logger, Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { EmailService } from './email.service'

@Module({
  imports: [AuthModule],
  providers: [
    EmailService,
    Logger
  ],
  exports: [EmailService]
})
export class EmailModule {}
