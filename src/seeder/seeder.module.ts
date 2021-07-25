import { Logger, Module } from '@nestjs/common';
import { DBConnection } from 'src/db.config';
import { EnvValidation } from 'src/env.validation';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
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
