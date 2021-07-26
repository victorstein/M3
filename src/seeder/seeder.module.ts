import { Logger, Module } from '@nestjs/common';
import { DBConnection } from 'db.config';
import { EnvValidation } from 'env.validation';
import { UserModule } from 'user/user.module';
import { RoleModule } from 'role/role.module';
import { Seeder } from './seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    EnvValidation,
    DBConnection,
    RoleModule,
    UserModule
  ],
  providers: [Logger, SeederService, Seeder]
})
export class SeederModule {}
