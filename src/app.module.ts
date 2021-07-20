import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConnection } from './db.config';
import { envValidation } from './env.validation';

@Module({
  imports: [envValidation, dbConnection],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
