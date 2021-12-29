import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const cookieSecret = configService.get('COOKIE_SECRET')

  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser(cookieSecret))
  const port = configService.get('PORT')
  await app.listen(port)
}
bootstrap()
  .catch((e) => console.log(e))
