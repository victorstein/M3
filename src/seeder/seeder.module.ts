import { Logger, Module } from '@nestjs/common'
import { DBConnection } from 'config/db.config'
import { EnvValidation } from 'config/env.validation'
import { UserModule } from 'user/user.module'
import { RoleModule } from 'role/role.module'
import { Seeder } from './seeder'
import { SeederService } from './seeder.service'
import { QueueModule } from 'queue/queue.module'
import { AuthModule } from 'auth/auth.module'
import { EmailModule } from 'email/email.module'
import { EmailConfig } from 'config/email.config'
import { BullConfig } from 'config/queue.config'
@Module({
  imports: [
    EnvValidation,
    DBConnection,
    BullConfig,
    EmailConfig,
    RoleModule,
    UserModule,
    QueueModule,
    AuthModule,
    EmailModule
  ],
  providers: [Logger, SeederService, Seeder]
})
export class SeederModule {}
