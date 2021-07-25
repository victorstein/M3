import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConnection } from './db.config';
import { envValidation } from './env.validation';
import { graphqlConfig } from './graphql.config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
@Module({
  imports: [
    envValidation,
    dbConnection,
    graphqlConfig,
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
