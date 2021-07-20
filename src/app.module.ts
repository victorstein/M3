import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from './env.validation';

@Module({
  imports: [envValidation],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
