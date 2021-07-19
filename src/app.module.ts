import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ ...envValidation, isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
