import { Module } from '@nestjs/common'
import { DBConnection } from './config/db.config'
import { EnvValidation } from './config/env.validation'
import { GraphqlConfig } from './config/graphql.config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RoleModule } from './role/role.module'
import { BullConfig } from 'config/queue.config'
import { EmailModule } from './email/email.module'
import { QueueModule } from './queue/queue.module'
import { EmailConfig } from 'config/email.config'
@Module({
  imports: [
    EnvValidation,
    DBConnection,
    GraphqlConfig,
    BullConfig,
    QueueModule,
    EmailConfig,
    EmailModule,
    RoleModule,
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
