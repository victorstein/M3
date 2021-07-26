import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBConnection } from './db.config';
import { EnvValidation } from './env.validation';
import { graphqlConfig } from './graphql.config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
@Module({
  imports: [
    EnvValidation,
    DBConnection,
    graphqlConfig,
    RoleModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
